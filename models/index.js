const User = require('./User');
const Goals = require('./Goals');
const Budget = require('./Budget');
// const Category = require('./Category');

User.hasMany(Budget, {
    foreignKey: 'user_id'
});

User.hasMany(Goals, {
    foreignKey: "user_id",
});

Budget.belongsTo(User, {
    foreignKey: 'user_id'
});

// Category.belongsTo(User, {
//     foreignKey: 'user_id'
// });

// Budget.belongsTo(Category, {
//     foreignKey: 'category_id',
//     as: 'category'
// });

// Category.hasMany(Budget, {
//     foreignKey: 'category_id',
//     as: 'budgets'
// });

Goals.belongsTo(User, {
    foreignKey: 'user_id'
});

module.exports = { User, Goals, Budget};
