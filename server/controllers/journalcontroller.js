const Express = require("express")
const router = Express.Router()

router.get("/practice", (req, res) => {
    res.send("Hey!! This is a practice route!")
})

router.get("/about", (req, res) => {
    res.send("This is the about route!")
})

module.exports = router