// const { Model, DataTypes } = require('sequelize');
// const sequelize = require('../config/connection');

// class Category extends Model {}

// Category.init({
//     // Assuming an auto-generated ID field
//     id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//         allowNull: false
//     },
//     name: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     budget: {
//         type: DataTypes.DECIMAL(10, 2), // Adjust as per your requirement
//         allowNull: false,
//         defaultValue: 0.00
//     },
//     goal: {
//         type: DataTypes.DECIMAL(10, 2), // Adjust as per your requirement
//         allowNull: false,
//         defaultValue: 0.00
//     }
// }, {
//     sequelize,
//     modelName: 'Category',
//     timestamps: true // Set this based on your requirement
// });

// //exporting model to index.js -tb
// module.exports = Category;
