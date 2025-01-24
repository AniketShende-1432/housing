const jwt = require('jsonwebtoken');

exports.verifyAdmin = (req, res, next) => {
    const token = req.cookies.adminToken;  // Assuming JWT token is stored in cookies
    if (!token) {
        return res.status(401).json({ message: 'Authorization required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        req.user = decoded; // Attach user info to request
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};