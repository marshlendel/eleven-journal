const Sequelize = require("sequelize")
const dbConnection = new Sequelize("postgres://postgres:005d4a65e07d4f1b8c5387e095c3591d@localhost:5432/eleven-journal")

module.exports = dbConnection