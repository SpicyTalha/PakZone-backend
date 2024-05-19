const cloudinary = require('cloudinary')
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API, 
    api_secret: process.env.CLOUD_SECRET
  });

  const cloudinaryUploadImg = async (fileToUpload) => {
    return new Promise((resolve) => {
        cloudinary.uploader.upload(fileToUpload, (result) => {
            resolve({url: result.secure_url},{
                resource_type: "auto",
            })
        })
    })
  }

  module.exports = cloudinaryUploadImg