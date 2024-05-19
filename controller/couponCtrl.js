const Coupon = require('../models/couponModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongoDbId');

const createCoupon = asyncHandler(async (req, res) => {
    try{
        const newCoupon = await Coupon.create(req.body);
        res.json(newCoupon)
    }catch(error){
        throw new Error(error)
    }
})

const getAllCoupon = asyncHandler(async (req, res) => {
    try{
        const newCoupon = await Coupon.find(req.body);
        res.json(newCoupon)
    }catch(error){
        throw new Error(error)
    }
})

const updateCoupon = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const newCoupon = await Coupon.findByIdAndUpdate(id, req.body, {new: true});
        res.json(newCoupon)
    }catch(error){
        throw new Error(error)
    }
})

const deleteCoupon = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const newCoupon = await Coupon.findByIdAndDelete(id);
        res.json(newCoupon)
    }catch(error){
        throw new Error(error)
    }
})

const getaCoupon = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const newCoupon = await Coupon.findById(id);
        res.json(newCoupon)
    }catch(error){
        throw new Error(error)
    }
})

module.exports = {createCoupon, getAllCoupon, updateCoupon, deleteCoupon, getaCoupon}