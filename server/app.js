//! Imports
const Express = require('express')
const app = Express()
const controllers = require("./controllers")
const dbConnection = require("./db")
require("dotenv").config() //using the config() env method makes the items in the .env file globally available

dbConnection.authenticate()
    .then(() => dbConnection.sync()) //Resolves the promise calls the sync method to sync all models to the database
    .then(() => {
        app.listen(3000, () => {
            console.log("[Server]: App is listening on port 3000")
        })
    })
    .catch((err) => { //Promise rejection that fires an error if there's any errors
        console.log(`[Server]: Server crashed. Error = ${err}`)
    })

app.use(Express.json()) //Express middleware function that allows requests to be JSON-ified so it can be parsed and interpreted from the body
app.use("/journal", controllers.journalController)
app.use("/user", controllers.userController)