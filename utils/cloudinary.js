const cloudinary = require('cloudinary');
const { assert } = require('joi');
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API, 
    api_secret: process.env.CLOUD_SECRET
  });

  const cloudinaryUploadImg = async (fileToUpload) => {
    return new Promise((resolve) => {
        cloudinary.uploader.upload(fileToUpload, (result) => {
            resolve({url: result.secure_url,
                asset_id: result.asset_id,
                public_id: result.public_id,
            },{
                resource_type: "auto",
            })
        })
    })
  }

  const cloudinaryDeleteImg = async (fileToDelete) => {
    return new Promise((resolve) => {
        cloudinary.uploader.destroy(fileToDelete, (result) => {
            resolve({url: result.secure_url,
                asset_id: result.asset_id,
                public_id: result.public_id,
            },{
                resource_type: "auto",
            })
        })
    })
  }
  module.exports = {cloudinaryUploadImg, cloudinaryDeleteImg}