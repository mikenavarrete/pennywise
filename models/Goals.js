//! Plan to not use. Will keep in case.

// const { Model, DataTypes } = require('sequelize')
// const sequelize = require('../config/connection')

// class Goals extends Model { }

// Goals.init(
//     {
//         id: {
//             type: DataTypes.INTEGER,
//             allowNull: false,
//             primaryKey: true,
//             autoIncrement: true
//         }
//     },
//     {
//         title: {
//             type: DataTypes.STRING,
//             allowNull: false
//         }
//     },
//     {
//         description: {
//             type: DataTypes.STRING,
//             allowNull: false
//         }
//     },
//     {
//         targetAmount: {
//             type: DataTypes.DECIMAL,
//             allowNull: false,
//             validate: {
//                 isNumeric: true
//             }
//         }
//     },
//     {
//         currentAmount: {
//             type: DataTypes.DECIMAL,
//             allowNull: false,
//             validate: {
//                 isNumeric: true
//             }
//         }
//     },
//     {
//         //the users input must be a date, but if user does not enter a date the current date will be applied -tb
//         deadline: {
//             type: DataTypes.DATE,
//             allowNull: false,
//             defaultValue: DataTypes.NOW
//         }
//     },
//     {
//         //this userId from the Goals model will be associated with the User model and with its primary key
//         user_id: {
//             type: DataTypes.INTEGER,
//             references: {
//                 model: 'user',
//                 key: 'id'
//             }
//         }
//     },
//     {
//         sequelize,
//         timestamps: true,
//         freezeTableName: true,
//         underscored: true,
//         modelName: 'goal',
//     }
// )

// //exporting to index.js -tb
// module.exports = Goals