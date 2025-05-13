const jwt = require("jsonwebtoken");

// Function to generate a token for the user
const generateToken = (userId) => {
    return jwt.sign({ _id: userId }, process.env.SECRET_KEY, { expiresIn: "1h" });
}

// Function to verify the validity of the token
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
        return null; // Return null if token is invalid
    }
}

// Function to renew an expired token
const renewToken = (token, userId) => {
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY, { ignoreExpiration: true });
        if (decoded._id !== userId) {
            return null;
        }
        return jwt.sign({ _id: userId }, process.env.SECRET_KEY, { expiresIn: "3h" });
    } catch (err) {
        return null; // Return null if token is invalid or some other error occurs
    }
}

module.exports = { generateToken, verifyToken, renewToken };
