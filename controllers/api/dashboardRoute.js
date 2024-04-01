const router = require('express').Router()
const { Budget, Category } = require('../../models')
const withAuth = require( '../../utils/auth');

// Requesting and finding all data from models Budget and Category 
router.get('/dashboard', withAuth, async (req, res) => {
    try {
        //added variable that finds all budgets and categories when user is sent to the dashboard
        const budgetData = await Budget.findAll({
            where: {
                user_id: req.session.user_id
            }
        })

        const categoryData = await Category.findAll({
            where: {
                user_id: req.session.user_id
            }
        })
        //using destructuring to separate out the data needed
        const budgets = budgetData.map(budget => budget.get({ plain: true }));
        const categories = categoryData.map(category => category.get({ plain: true }));
        //renders the data to the main dashboard
        res.render('dashboard', { budgets, categories, logged_in: req.session.logged_in })
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;
