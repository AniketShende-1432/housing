const router = require("express").Router();
const User = require("../models/user");
require('dotenv').config()
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const twilio = require('twilio');
const crypto = require('crypto');

router.post("/register", async (req, res) => {
    try {
        const { name, email, usertype, phone, agreement, password } = req.body;
        // Check if a user with the given email or username already exists
        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            // If user already exists, return an error response
            return res.status(200).json({ message: "User Already Exists" });
        }
        const hpassword = bcrypt.hashSync(password);
        // If user doesn't exist, create a new user
        const user = new User({ name, email, usertype, phone, agreement, password: hpassword });
        await user.save();
        // Send success response
        res.status(200).json({ message: "SignUp Successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

router.post("/signin", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(200).json({ message: "Please sign up first" });
        }
        if (req.body.usertype === "Agent/Builder") {
            if (user.usertype !== "Agent" && user.usertype !== "Builder") {
                return res.status(200).json({ message: "Incorrect UserType" });
            }
        } else if (req.body.usertype !== user.usertype) {
            return res.status(200).json({ message: "Incorrect UserType" });
        }

        const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);
        if (!isPasswordCorrect) {
            return res.status(200).json({ message: "Incorrect password" });
        }

        // If sign-in is successful, return user data (excluding password)
        const token = jwt.sign(
            { id: user._id, email: user.email }, // Payload
            process.env.JWT_SECRET,               // Secret key
            { expiresIn: process.env.JWT_EXPIRATION }  // Token expiration time
        );
        res.cookie('authToken', token, {
            httpOnly: true, // Prevent access by JavaScript
            secure: process.env.NODE_ENV === 'production', // Send only over HTTPS
            sameSite: 'Lax', // CSRF protection
            maxAge: 12 * 60 * 60 * 1000, // 1 hour in milliseconds
            path: '/'
        });
        return res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
});

router.get('/checkAuth', (req, res) => {
    const token = req.cookies.authToken; // JWT from the cookie
    if (!token) {
        return res.status(200).json({ authenticated: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json({ authenticated: true, user: decoded });
    } catch (error) {
        res.status(401).json({ authenticated: false });
    }
});

router.get("/profile", async (req, res) => {
    const token = req.cookies.authToken;
    if (!token) {
        return res.status(200).json({ message: "Please Login first" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const { password, ...userData } = user._doc; // Exclude password from response
        res.status(200).json(userData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('authToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        path: '/'
    });
    res.status(200).json({ message: 'Logout successful' });
});

router.put("/profile", async (req, res) => {
    try {
        const token = req.cookies.authToken;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const { name, email, phone, usertype } = req.body; // Extract data from the request body
        // Find the user by ID and update the document
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, email, phone, usertype },
            { new: true } // This returns the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(updatedUser); // Return the updated user data
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

router.put("/profile/password", async (req, res) => {
    try {
        const token = req.cookies.authToken;
        const { currentPassword, newPassword } = req.body;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verify current password
        const isMatch = bcrypt.compareSync(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect current password" });
        }

        // Hash the new password
        const hashedPassword = bcrypt.hashSync(newPassword);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const otpStore = {};
const generateOTP = () => crypto.randomInt(10000, 99999).toString();
router.post('/send-otp', async (req, res) => {
    let { phoneNumber, usertype } = req.body;
    try {
        const user = await User.findOne({ phone: phoneNumber });
        if (!user) {
            return res.status(404).json({ message: 'Please Sign Up First !!' });
        }
        if (usertype === "Agent/Builder") {
            if (user.usertype !== "Agent" && user.usertype !== "Builder") {
                return res.status(200).json({ message: "Incorrect UserType" });
            }
        } else if (usertype !== user.usertype) {
            return res.status(200).json({ message: "Incorrect UserType" });
        }

        const otp = generateOTP();
        // Store OTP with an expiration time (5 minutes)
        otpStore[phoneNumber] = { otp, expiresAt: Date.now() + 300000 };
        // Send OTP via Twilio
        phoneNumber = `+91${phoneNumber}`;
        await client.messages.create({
            body: `Your OTP code is ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,  // Your Twilio phone number
            to: phoneNumber,  // User's phone number
        });

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error.message);
        res.status(500).json({ message: 'Failed to send OTP' });
    }
});

router.post('/verify-otp', async (req, res) => {
    const { phoneNumber, otp } = req.body;

    // Check if the OTP is valid and not expired
    const storedOtpData = otpStore[phoneNumber];
    if (!storedOtpData || storedOtpData.otp !== otp || storedOtpData.expiresAt < Date.now()) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    // Clear OTP from store after successful verification
    delete otpStore[phoneNumber];

    try {
        // Fetch user details from the database
        const user = await User.findOne({ phone: phoneNumber });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,  // Secret key
            { expiresIn: process.env.JWT_EXPIRATION || '1h' }  // Token expiration time (default 1 hour)
        );

        // Send JWT token in a secure cookie
        res.cookie('authToken', token, {
            httpOnly: true,  // Prevent access by JavaScript
            secure: process.env.NODE_ENV === 'production',  // Send only over HTTPS
            sameSite: 'Lax',  // CSRF protection
            maxAge: 12 * 60 * 60 * 1000,  // 12 hours in milliseconds
            path: '/'
        });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error verifying OTP:', error.message);
        res.status(500).json({ message: 'Error verifying OTP' });
    }
});

router.get('/get-coin', async (req, res) => {
    const token = req.cookies.authToken;
    if (!token) {
        return res.status(200).json({ message: "Please Login first" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ coins: user.coins });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

router.put("/update-coins", async (req, res) => {
    const token = req.cookies.authToken;
    if (!token) {
        return res.status(200).json({ message: "Please Login first" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const { coinsChange } = req.body; // Positive to add coins, negative to deduct

        const user = await User.findByIdAndUpdate(
            userId,
            { $inc: { coins: coinsChange } },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ success: true, coins: user.coins });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});


module.exports = router;