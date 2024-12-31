const jwt = require('jsonwebtoken');
const dotenv=require('dotenv')
dotenv.config()
const auth = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
   
    console.log(token)
    if (!token) return res.status(401).json({ message: 'Access Denied' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = verified;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid Token' });
    }
};

module.exports = auth;
