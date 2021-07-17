const router = require("express").Router()
const {UserModel} = require("../models")  //Unpacking UserModel property out of the object in the index.js

router.post("/register", async (req, res) => {
    UserModel.create({
        email: req.body.email,
        password: req.body.password
    })
})

module.exports = router