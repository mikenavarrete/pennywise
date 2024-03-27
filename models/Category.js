const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Category extends Model {}

Category.init(
    {
        id: {
            //category model id -tb
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            //name of the Category -tb
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            //the description for the category -tb
            type: DataTypes.STRING,
            allowNull: true // Changed to true, as descriptions are often optional
        },
        user_id: {
            //the userId will be associated with the Category model, using the primary key from the id in the User model -tb
            type: DataTypes.INTEGER,
            allowNull: true, // Changed to true, as the user_id might be optional
            references: {
                model: 'user',
                key:  'id'
            }
        }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'category',
    }
);

//exporting model to index.js -tb
module.exports = Category;
