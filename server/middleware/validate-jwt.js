const jwt = require("jsonwebtoken")
const {UserModel} = require("../models")

//!This asynchronous functinon ultimately checks if there's a token attached in the request
const validateJWT = async (req, res, next) => {
    //!Checks the method of the request. Sometimes method is OPTIONS, first part of the preflighted request and not the normal GET, POST, etc
    //Like a sneak peak before the actual request
    if(req.method == "OPTIONS") {
        next() //A nested middleware function that when called passes control to the next middleware function

    //!If we are dealing with GET, POST, PUT, etc.. want to check if there's data in authorization header and if it contains word Bearer
    }else if(req.headers.authorization && req.headers.authorization.includes("Bearer")) {
        const {authorization} = req.headers //Unpacking the authorization object from the header
        // console.log("authorization -->", authorization)

        //!This ternary checks if authorization is truthy, if it is, then it verifies it and decrypts it with the secret key, if not it returns a value of undefined
        const payload = (authorization) ? jwt.verify((authorization.includes("Bearer")) ? authorization.split(" ")[1] : authorization, process.env.JWT_SECRET) 
        : undefined                                                           //first paramter is our token (without the word bearer in it)   second parameter is the key                                     
        // console.log("payload-->", payload)
        //!If payload comes back as truthy uses sequelize to search if there's a user in the database that matches id in the token
        if(payload) {
            let foundUser = await UserModel.findOne({where: { id: payload.id}})
            // console.log("foundUser -->", foundUser)
            if(foundUser) { 
                // console.log("request -->", req)
                req.user = foundUser //If a user that matches the id is found then create a new property called user to express request object and assign the value as the foundUser object: which includes the email and password which is crucial to have access to
                next() //middleware argument that exits out of the function
            }else {
                res.status(400).send({message: "Not authorized"}) //If a user can't be found in db from the payload
            }
        }else { 
            res.status(401).send({message: "Invalid token"}) //If the ternary passed undefined cause authorization wasn't truthy
        }
    }else {
        res.status(403).send({message: "Forbidden"}) //If there is no authorization in the header at all or does not include the word bearer
    }
}

module.exports = validateJWT