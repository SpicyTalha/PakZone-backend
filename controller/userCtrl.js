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

const loginUserCtrl = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const findUser = await user.findOne({ email })
    if (findUser) {
        const isPasswordMatched = await findUser.isPasswordMatched(password);
        if (isPasswordMatched) {
            res.status(200).json({ msg: 'Login successfully' });
            res.json({
                _id: findUser?._id,
                firstname: findeUser?.firstname,
                lastname: findUser?.lastname,
                email: findUser?.email,
                token: generateToken(findUser?._id),    
            })
        }
    } else {
        throw new Error('Invalid email or password');
    }
});

const getallUser = asyncHandler(async (req, res) => {
    try{
        const getUsers = await user.find({});
        res.json(getUsers);
    }catch(error){
        throw new Error(error);
    }
});


module.exports = { createUser, loginUserCtrl, getallUser };