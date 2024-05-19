const user = require('../models/userModel');
const asyncHandler = require('express-async-handler');


const createUser = asyncHandler(async (req, res) => {
    try {
        const email = req.body.email;
        const findUser = await user.findOne({ email: email });
        if (!findUser) {
            // Creating a new user
            const newUser = await user.create(req.body);
            res.status(201).json(newUser);
        } else {
            // The user already exists
            throw new Error('User already exists');
        }
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

module.exports = { createUser };