const user = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const {generateToken} = require('../config/jwtToken');
const validateMongoDbId = require('../utils/validateMongoDbId');
const {generateRefreshToken} = require('../config/refreshToken');
const jwt = require('jsonwebtoken');
const sendEmail = require('./emailCtrl');
const crypto = require('crypto');

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
            const refreshToken = await generateRefreshToken(findUser?._id);
            const updateUser = await user.findByIdAndUpdate(findUser?._id, {
                refreshToken: refreshToken}, 
                {new: true});
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                maxAge: 3*60*60*1000
            })
            res.status(200).json({
                _id: findUser?._id,
                firstname: findUser?.firstname,
                lastname: findUser?.lastname,
                email: findUser?.email,
                mobile: findUser?.mobile,
                token: generateToken(findUser?._id),    
            })
        }
    } else {
        throw new Error('Invalid email or password');
    }
});

//handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) =>{
    const cookie = req.cookies;
    if (!cookie.refreshToken) {
        throw new Error("No refresh token found in cookies");
    }
    const refreshToken = cookie.refreshToken;
    console.log(refreshToken);
    const getUser = await user.findOne({refreshToken});
    if (!getUser) throw new Error("No user found with this refresh token");
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || getUser.id !== decoded.id){
                console.log(decoded)
                throw new Error("There is something wrong with the refresh token");
            }
            const accessToken = generateToken(getUser?._id);
            res.json(accessToken)
        })
})

//handle logout
const logoutUser = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie.refreshToken) {
        throw new Error("No refresh token found in cookies");
    }
    const refreshToken = cookie.refreshToken;
    const getUser = await user.findOne({refreshToken});
    if (!getUser) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204); //forbidden
    }
    await user.findOneAndUpdate({refreshToken}, {refreshToken: ""});
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
    });
    return res.sendStatus(204); //forbidden
})

const getallUser = asyncHandler(async (req, res) => {
    try{
        const getUsers = await user.find({});
        res.json(getUsers);
    }catch(error){
        throw new Error(error);
    }
});

//get a single user
const getaUser = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    console.log(id)
    try{
        const getaUser = await user.findById(id);
        res.json(getaUser);
    }catch(error){
        throw new Error(error);
    }
})

//Update a User
const updateaUser = asyncHandler(async (req, res) => {
    const {_id} = req.user;
    validateMongoDbId(_id);
    try{
        const updateaUser = await user.findByIdAndUpdate(
            _id, 
            {
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            mobile: req?.body?.mobile, 
            },
            {
            new: true
            }
        );
        res.json(updateaUser);
    }catch(error){
        throw new Error(error);
    }
});

//delete a single user
const deleteaUser = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    console.log(id)
    try{
        const deleteaUser = await user.findByIdAndDelete(id);
        res.json(deleteaUser);
    }catch(error){
        throw new Error(error);
    }
})

//block a user
const blockUser = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const blockUser = await user.findByIdAndUpdate(id, {isBlocked: true}, {new: true});
        res.json({
            message: "User has been blocked successfully"
        });
    }catch(error){
        throw new Error(error);
    }
})

//unblock a user
const unblockUser = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const blockUser = await user.findByIdAndUpdate(id, {isBlocked: false}, {new: true});
        res.json({
            message: "User has been unblocked successfully"
        });
    }catch(error){
        throw new Error(error);
    }
})

const updatePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { password } = req.body; // Destructure to get the password
    validateMongoDbId(_id); // Assuming this function validates MongoDB IDs

    try {
        const User = await user.findById(_id); // Find the user by ID
        if (User && password) {
            User.password = password; // Update the password on the user instance
            const updatedUser = await User.save(); // Save the updated user instance
            res.json(updatedUser); // Respond with the updated user
        } else {
            res.status(400).json({ message: "Password not provided" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const User = await user.findOne({ email });
    if (!User){
        res.status(404)
        throw new Error("No user found with this email");
    }
    try{
        const token = await User.createPasswordResetToken();
        await User.save();
        const resetURL = `Hello, ${User.firstname}, click on the link below to reset your password: <a href='http://localhost:4000/api/user/reset-password/${token}'>Reset Password</a>. The Link will expire in 10 minutes`;
        const data = {
            to: email,
            text: "Meow",
            subject: "Reset Password",
            htm: resetURL,
        }
        await sendEmail(data);
        res.json(token);
    }catch(error){
        throw new Error(error);
    }
})

const resetPassword = asyncHandler(async (req, res) => {
    const {password} = req.body;
    const {token} = req.params;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const User = await user.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {$gt: Date.now()}
    })
    if (!User){
        throw new Error("Token is invalid or has expired");
    }
    User.password = password;
    User.passwordResetToken = undefined;
    User.passwordResetExpires = undefined;
    await User.save();
    res.json(User)
})

module.exports = { createUser,
    loginUserCtrl,
    getallUser,
    getaUser,
    deleteaUser,
    updateaUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logoutUser,
    updatePassword,
    forgotPasswordToken,
    resetPassword
};