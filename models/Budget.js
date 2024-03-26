const { Model, Datatypes } = require('sequelize')
const sequelize = require('../config/connection')

class Budget extends Model { }

Budget.init(
    {
        id: {
            type: Datatypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        }
    },
    {
        title: {
            type: Datatypes.STRING,
            allowNull: false
        }
    },
    {
        totalAmount: {
            type: Datatypes.DECIMAL,
            allowNull: false
        }
    },
    {
        //the userId will be associated with the Budget model, using the primary key from the id in the User model
        user_id: {
            type: Datatypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        timestamps: true,
        freezeTableName: true,
        underscored: true,
        modelName: 'budget',
    }
)

module.exports = Budget;
