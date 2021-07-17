const dbConnection = require("../db")
const {DataTypes} = require("sequelize")

//!Making the User model         //This the name of the table becomes plural in Postgres
const User = dbConnection.define("user", {
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },

    password: {
        type: DataTypes.STRING(),
        allowNull: false,
    }
})

module.exports = User
