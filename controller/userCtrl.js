const user = require('../models/userModel')


const createUser = async (req, res) => {
    const email = req.body.email;
    const findUser = await user.findOne('email');
    if (!findUser){
        //Creating a new user
        const newUser = user.create(req.body);
        res.json(newUser)
    }
    else{
        //The user already exists
        res.json({
            msg: "User already Exists",
            success: false,
        })
    }
}

module.exports = {createUser}