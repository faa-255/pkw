const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No Token Provided' });
    }

    try {
        // ตัดคำว่า "Bearer " ออก
        const tokenClean = token.replace('Bearer ', '');
        const verified = jwt.verify(tokenClean, process.env.JWT_SECRET || 'secret_key_earth_tone');
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid Token' });
    }
};

// Middleware สำหรับเช็ค Admin
exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access Denied: Admin only' });
    }
};