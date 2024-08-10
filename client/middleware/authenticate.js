const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
KEY='NAMAN123456789'
const keysecret = process.env.KEY;

const authenicate = async (req, res, next) => {
    try {
        const token = req.cookies.eccomerce;

        if (!token) {
            return res.status(401).send("No token provided");
        }
        
        const verifyToken = jwt.verify(token, keysecret);

        const rootUser = await User.findOne({ _id: verifyToken._id, "tokens.token": token });

        if (!rootUser) {
            return res.status(401).send(" User not found");
        }

        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;

        next();
    } catch (error) {
        console.error("Authentication error:", error.message);
        res.status(401).send(" Token verification failed");
    }
};

module.exports = authenicate;
