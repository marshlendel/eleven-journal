const dbConnection = require("..//db")
const {DataTypes} = require("sequelize")

const Journal = dbConnection.define("journal", {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },

    date: {
        type: DataTypes.STRING,
        allowNull: false
    },

    entry: {
        type: DataTypes.STRING,
        allowNull: false
    },

    owner: {
        type: DataTypes.INTEGER
    }
})

module.exports = Journal