const user = require('../models/userModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const Coupon = require('../models/couponModel');
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
    const findUser = await user.findOne({ email });
    if (!findUser) {
        res.status(401);
        throw new Error('Invalid email or password');
    }

    const isPasswordMatched = await findUser.isPasswordMatched(password);

    if (!isPasswordMatched) {
        res.status(401);
        throw new Error('Invalid email or password');
    }

    const refreshToken = await generateRefreshToken(findUser?._id);
    const updateUser = await user.findByIdAndUpdate(
        findUser._id,
        { refreshToken: refreshToken },
        { new: true }
    );

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 3 * 60 * 60 * 1000, // 3 hours
    });

    res.status(200).json({
        _id: findUser?._id,
        firstname: findUser?.firstname,
        lastname: findUser?.lastname,
        email: findUser?.email,
        mobile: findUser?.mobile,
        token: generateToken(findUser?._id),
    });
});

//admin login
const loginAdminCtrl = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const findAdmin = await user.findOne({ email });
    if (findAdmin.role !== "admin") {
        throw new Error ("You are not authorized to access this route");
    }
    if (!findAdmin) {
        res.status(401);
        throw new Error('Invalid email or password');
    }

    const isPasswordMatched = await findAdmin.isPasswordMatched(password);

    if (!isPasswordMatched) {
        res.status(401);
        throw new Error('Invalid email or password');
    }

    const refreshToken = await generateRefreshToken(findAdmin?._id);
    const updateAdmin = await user.findByIdAndUpdate(
        findAdmin._id,
        { refreshToken: refreshToken },
        { new: true }
    );

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 3 * 60 * 60 * 1000, // 3 hours
    });

    res.status(200).json({
        _id: findAdmin?._id,
        firstname: findAdmin?.firstname,
        lastname: findAdmin?.lastname,
        email: findAdmin?.email,
        mobile: findAdmin?.mobile,
        token: generateToken(findAdmin?._id),
    });
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

//save user address
const saveAddress = asyncHandler(async (req, res, next) => {
    const {_id} = req.user;
    validateMongoDbId(_id);
    try{
        const updateaUser = await user.findByIdAndUpdate(
            _id, 
            {
            address: req?.body?.address,
            },
            {
            new: true
            }
        );
        res.json(updateaUser);
    }catch(error){
        throw new Error(error);
    }
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

const getWishList = asyncHandler(async (req, res) => {
    const {_id} = req.user
    try{
        const findUser = await user.findById(_id).populate('wishlist')
        res.json(findUser)
    }catch(error){
        throw new Error(error);
    }
})

const userCart = asyncHandler(async (req, res) => {
    const { cart } = req.body;
    const { _id } = req.user;
    validateMongoDbId(_id);   
    try {
        let Products = [];
        // Fetch the user document
        const User = await user.findById(_id);
        
        // Check if the product is already in the cart
        const alreadyExistCart = await Cart.findOne({ orderBy: User._id });
        if (alreadyExistCart) {
            alreadyExistCart.remove();
        }
        
        // Loop through the items in the cart
        for (let i = 0; i < cart.length; i++) {
            const object = {};
            object.product = cart[i]._id;
            object.count = cart[i].count;
            object.color = cart[i].color;
            
            // Find the product by ID and select only the price field
            const getPrice = await Product.findById(cart[i]._id).select("price").exec();
            
            // If product found, add its price to the object
            if (getPrice) {
                object.price = getPrice.price;
            } else {
                // Handle case where product with given ID is not found
                console.log(`Product with ID ${cart[i]._id} not found.`);
                // You might want to decide what to do in this case
            }
            
            Products.push(object);
        }
        let cartTotal = 0;
        for (let i = 0; i < Products.length; i++){
            cartTotal = cartTotal + Products[i].price * Products[i].count
        }
        let newCart = await new Cart({
            products: Products,
            cartTotal,
            orderedBy: User._id
        }).save();
        res.json(newCart); // Send the products back in the response
    } catch (error) {
        throw new Error(error);
    }
});

const getUserCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const UserCart = await Cart.findOne({ orderedBy: _id }).populate("products.product");
        res.json(UserCart);
    } catch (error) {
        throw new Error(error);
    }
})

const emptyCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const UserCart = await Cart.findOneAndDelete({ orderedBy: _id });
        res.json(UserCart);
    } catch (error) {
        throw new Error(error);
    }
})

const applyCoupon = asyncHandler(async (req, res) => {
    const {coupon} = req.body;
    const {_id} = req.user
    validateMongoDbId(_id)
    const validCoupon = await Coupon.findOne({name: coupon});
    console.log(validCoupon)
    if(validCoupon === null){
        throw new Error ("Invalid Coupon")
    } 
    const User = await user.findOne({_id})
    let {cartTotal} = await Cart.findOne({orderedBy: User._id}).populate("products.product");
    let totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount)/100).toFixed(2)
    await Cart.findOneAndUpdate({orderedBy: User._id}, {totalAfterDiscount}, {new: true})
    res.json (totalAfterDiscount)
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
    resetPassword, 
    loginAdminCtrl,
    getWishList,
    saveAddress,
    userCart,
    getUserCart,
    emptyCart,
    applyCoupon
};