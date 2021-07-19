const Express = require("express")
const router = Express.Router()
let validateJWT = require("../middleware/validate-jwt")
const {JournalModel} = require("../models")

//!Create Journal
router.post("/create", validateJWT, async (req, res) => {
    const {title, date, entry} = req.body
    const {id} = req.user
    const JournalEntry = {
        title,
        date,
        entry,
        owner: id
    }

    try{
        //.create() is sequelize method that lets us create an instance of the data model and send it off to the database as long as the data types match the model
        const newJournal = await JournalModel.create(JournalEntry) 
        res.status(200).json(newJournal)
    }catch(err) {
        res.status(500).json({error: err})
    }
    // JournalModel.create(JournalEntry)
})

//!Get All Entries
router.get("/", validateJWT, async(req, res) => {
    try {
        const entries = await JournalModel.findAll()
        res.status(200).json(entries)
    }catch {
        res.status(500).json({
            error: err
        })
    }
})

//!Get Entries by User
router.get("/mine", validateJWT, async (req, res) => {
    let {id} = req.user
    try {
        const myEntries = await JournalModel.findAll({
            where: {
                owner: id
            }
        })
        res.status(200).json(myEntries)
    }catch {
        res.status(500).json({
            error: err
        })
    }
})

//!Get Entries by title
router.get("/:title", validateJWT, async(req, res) => {
    const {title} = req.params
    try {
        const titleEntries = await JournalModel.findAll({
            where: {
                title: title
            }
        })
        res.status(200).json(titleEntries)
    }catch {
        res.statusMessage(500).json({
            error: err
        })
    }
})

//!Update a Journal
router.put("/update/:entryId", validateJWT, async (req, res) => {
    const {title, date, entry} = req.body
    const journalId = req.params.entryId //What we use to select the journal we want to update
    const userId = req.user.id //The user id passed from the JWT from the user's token

    const query = {
        where: {
            id: journalId, //selector for which entry we want to update
            owner: userId // So that entries that don't belong to this user can't be updated
        }
    }

    const upDatedJournal = {
        title: title,
        date: date,
        entry: entry
    }

    try {
        //First argument is the new, updated instance of the journal we send to the db, second is the selected entry we're actually updating
        const update = await JournalModel.update(upDatedJournal, query) 
        res.status(200).json({
            updatedJournal: await JournalModel.findOne(query)
        })
    }catch(err) {
        res.status(500).json({
            error: err
        })
    }
})

//!Delete Journal
router.delete("/delete/:journalId", validateJWT, async (req, res) => {
    const {journalId} = req.params
    const ownerId = req.user.id
    try {
        const query = {
            where: {
                id: journalId,
                owner: ownerId
            }
        }
        await JournalModel.destroy(query)
        res.status(200).json({
            message: "Journal destroyed !"
        })
    }catch(err) {
        res.status(500).json({
            error: err
        })
    }
})
module.exports = router