//bringing in User. Goals, Budget and Category models -tb
const User = require('./User')
const Goals = require('./Goals')
const Budget = require('./Budget')
const Category = require('./Category')


//relationships between models here -tb


//Exporting models to -tb
Model.exports = { User, Goals, Budget, Category }