const jwt = require("jsonwebtoken");
const JWT_SECRET = require('./config');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(403).json({})
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET, { expiresIn: "1h" });
        if (decoded) {
             req.userId = decoded.user._id;
            next();
        }
        else {
            return res.status(403).json({
                message: "User not authenticated decoded"
            })
        }
    }
    catch (err) {
        return res.status(403).json({
            message: "User not authenticated"
        })
    }
}

module.exports = {
    authMiddleware
}