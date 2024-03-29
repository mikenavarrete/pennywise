// Bringing in User, Goal, Budget, and Category models
const User = require('./User');
// const Goals = require('./Goals');
const Budget = require('./Budget');
const Category = require('./Category');

// The user will have many budgets. The foreign key from the Budget model that references the id in the Users model
User.hasMany(Budget, {
    foreignKey: 'user_id'
})

// The user will have many goals. The foreign key from the Goal model that references the id in the Users model
// User.hasMany(Goals, {
//     foreignKey: "user_id",
// })

// The budgets will belong to the User. The foreign key from the Budget model that references the id in the Users model
Budget.belongsTo(User, {
    foreignKey: 'user_id'
})

// The categories will belong to the user. The foreign key from the Category model that references the id in the Users model
Category.belongsTo(User, {
    foreignKey: 'user_id'
})

// The goals will belong to the user. The foreign key from the Goal model that references the id in the Users model
// Goals.belongsTo(User, {
//     foreignKey: 'user_id'
// })

// Exporting all relationships
module.exports = { User, Budget, Category }
