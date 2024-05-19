const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        try {
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded?.id)
                req.user = user;
                next();
            } else {
                throw new Error("Token not found");
            }
        } catch (error) {
            throw new Error("Token expired. Please login again");
        }
    } else {
        throw new Error("There is no token attached to the Header");
    }
});

module.exports = authMiddleware;
