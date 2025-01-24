const router = require("express").Router();
const User = require('../models/user');
const { verifyAdmin } = require('../middleware/authadmin');

router.get('/users',verifyAdmin, async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);  // Return all users
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});

module.exports = router;