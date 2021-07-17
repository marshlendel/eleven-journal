const router = require("express").Router()
const { UniqueConstraintError } = require("sequelize")
const {UserModel} = require("../models")  //Unpacking UserModel property out of the object in the index.js

//the controller is responsible for checking if the properties from the request match the models' properties
//! Register User
router.post("/register", async (req, res) => {
    try{
        let User = await UserModel.create({ //When we communicate with or queyr from our database, the action returns a promise, so gotta resolve n stuff
            email: req.body.email, 
            password: req.body.password
        })
        res.status(201).json({  //.status() allows us to send a status code to a response and .json() packages our response as a JSON, it's nearly identical to .send() but it can turn null and undefined into JSON objects too
            message: "User successfully registered",
            user: User
        })
    } catch(err) {
        if (err instanceof UniqueConstraintError) {
            res.status(409).json({
                message: "Email already in use"
            })
        }else {
            res.status(500).json({
                message: "Failed to register user"
            })
        }      
    }
})

module.exports = router