const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');

const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images'))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + ".jpeg")
    }
})

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb({
            message: 'Not an image! Please upload only images'
        }, false)
    }
}

const uploadPhoto = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 2000000 }
})

const productImgResize = async (req, res, next) => {
    try {
        if (!req.files) return next();
        //console.log("hi")
        await Promise.all(
            req.files.map(async (file) => {
                await sharp(file.path).resize(300, 300).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`public/images/products/${file.filename}`);
                fs.unlinkSync(`public/images/products/${file.filename}`);
            })
        );

        next();
    } catch (error) {
        next(error);
    }
}

const blogImgResize = async (req, res, next) => {
    try {
        if (!req.files) return next();

        await Promise.all(
            req.files.map(async (file) => {
                await sharp(file.path).resize(300, 300).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`public/images/blogs/${file.filename}`);
                fs.unlinkSync(`public/images/blogs/${file.filename}`);
            })
        );

        next();
    } catch (error) {
        next(error);
    }
}

module.exports = { uploadPhoto, productImgResize, blogImgResize }