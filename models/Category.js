const { Model, Datatypes } = require('sequelize')
const sequelize = require('../config/connection')

class Category extends Model {}

Category.init (
    {
        id: {
            //category model id -tb
            type: Datatypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        }
    },
    {
        name: {
            //name of the Category -tb
            type: Datatypes.STRING,
            allowNull: false
        }
    },
    {
        description: {
            //the description for the category -tb
            type: Datatypes.STRING,
            allowNull: false
        }
    },
    {
        user_id: {
            //the userId will be associated with the Category model, using the primary key from the id in the User model
            type: Datatypes.INTEGER,
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
)

//exporting model to index.js
module.exports = Category;
