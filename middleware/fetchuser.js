const jwt = require("jsonwebtoken");
require('dotenv').config()

const fetchuser = (req, res, next) => {
    // Get the userid from the auth-token and add it to req object
    let token = req.header('auth-token');
    if (!token) {
        res.status(401).json({error:"Please validate using valid token"})
    }
    try {
        var data = jwt.verify(token, process.env.JWT_SECRET)
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).json({error:"Please validate using valid token"})
    }
}

module.exports = fetchuser