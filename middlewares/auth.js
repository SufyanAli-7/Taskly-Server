const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    const token = authHeader?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.', isError: true });
    }

    const jwtSecret = process.env.JWT_SECRET || "ali";
    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (!err) {
            req.uid = decoded.uid;
            next();
        } else {
            console.error('Token verification failed:', err);
            return res.status(401).json({ message: 'Invalid token.', isError: true });
        }

    })

}


module.exports = { verifyToken }