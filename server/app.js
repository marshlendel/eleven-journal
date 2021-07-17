const Express = require('express')
const app = Express()

//! Imports
const controllers = require("./controllers")
const dbConnection = require("./db")

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