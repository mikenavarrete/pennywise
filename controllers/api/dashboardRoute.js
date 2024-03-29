const router = require('express').Router()
const { Budget, Category } = require('../../models')
const withAuth = require( '../../utils/auth');

// Requesting and finding all data from models Budget and Category 
router.get('/dashboard', withAuth, async (req, res) => {
    try {
        const budgets = await Budget.findAll()
        const categories = await Category.findAll()
        //renders the data to the main dashboard
        res.render('dashboard', { budgets, categories, logged_in: req.session.logged_in })
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;
