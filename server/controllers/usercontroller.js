const router = require("express").Router()
const { UniqueConstraintError } = require("sequelize")
const {UserModel} = require("../models")  //Unpacking UserModel property out of the object in the index.js
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

//the controller is responsible for checking if the properties from the request match the models' properties
//! Register User
router.post("/register", async (req, res) => {
    try{
        let User = await UserModel.create({ //When we communicate with or queyr from our database, the action returns a promise, so gotta resolve n stuff
            email: req.body.email, 
            password: bcrypt.hashSync(req.body.password, 13)
            
        })
                            //Payload, signature (used to encode and decode), option (expires in 24 hrs)
        let token = jwt.sign({id: User.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24})

        res.status(201).json({  //.status() allows us to send a status code to a response and .json() packages our response as a JSON, it's nearly identical to .send() but it can turn null and undefined into JSON objects too
            message: "User successfully registered",
            user: User,
            sessionToken: token
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

//! Login User
router.post("/login", async (req, res) => {
   let {email, password} = req.body
   
   try {
    let logInUser = await UserModel.findOne({
        where: { //The where clause is an object in sequelize that tells it to retrieve data based that matches its properties
            email: email
        }
    })
    if(logInUser) {                                  //Password from login request,  Pulls password from database (if callback is omitted, it returns a boolean in a promise)
        let passwordComparison = await bcrypt.compare(password, logInUser.password)

        if(passwordComparison) {
            let token = jwt.sign({id: logInUser.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24})

            res.status(200).json({
                message: "User successfully logged in",
                user: logInUser,
                sessionToken: token
            })
        }else {
            res.status(401).json({
                message: "Incorrect email or password"
            })
        }
       
    } else { // If the email did not match one in the database
        res.status(401).json({
            message: "Incorrect email or password" //Never want to tell the user which one is incorrect for security
        })
    }
   } catch(err) {
      res.status(500).json({
          message: "Failed to login"
      })
   }

})

module.exports = router