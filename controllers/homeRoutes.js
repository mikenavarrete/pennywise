//homeRouter for GET requests and rendering pages -tb

//bringing in express packages for routes -tb
const router = require('express').Router()
//bringing in models -tb
const { User, Budget, Goals } = require('../models')
//bringing in helper -tb
const withAuth = require('../utils/auth')


router.get('/', (req, res) => {
    //corrected syntax to logged_in instead of loggedIn to stay consistent with other code
    // this prevented the user from being redirected to the dashboard page if they were logged in -tb
    if (req.session.logged_in) {
        res.redirect('/dashboard');
    } else {
        res.render('login');
    }
});

//renders the login page to the user
// if user is logged in they will go to their dashboard, otherwise they see the login page again
router.get('/login', (req, res) => {
    //fixed logged_in syntax -tb
    if (req.session.logged_in) {
        res.redirect('/dashboard');
    } else {
        res.render('login');
    }
});


router.get('/dashboard', withAuth, async (req, res) => {
    try {
        const userData = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ['password'] },
            include: [{ model: Budget }, { model: Goals }]
        })

        // const budgetData = await Budget.findAll({
        //     where: { user_id: req.session.user_id }
        // });
        // const categoryData = await Category.findAll({
        //     where: { user_id: req.session.user_id }
        // });
        // const budgets = budgetData.map(budget => budget.get({ plain: true }));
        // const categories = categoryData.map(category => category.get({ plain: true }));
        res.render('dashboard', { ...userData, logged_in: req.session.logged_in });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/dashboard/budget', withAuth, async (req, res) => {
    try {
        const newBudget = await Budget.create({
            ...req.body,
            user_id: req.session.user_id
        });
        res.status(200).json(newBudget);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.post('/dashboard/category', withAuth, async (req, res) => {
    try {
        const newCategory = await Category.create({
            ...req.body,
            user_id: req.session.user_id
        });
        res.status(200).json(newCategory);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.delete('/dashboard/budget/:id', withAuth, async (req, res) => {
    try {
        const budget = await Budget.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id
            }
        });
        if (!budget) {
            res.status(404).json({ message: 'No budget found with this id.' });
            return;
        }
        res.status(200).json(budget);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.delete('/dashboard/category/:id', withAuth, async (req, res) => {
    try {
        const category = await Category.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id
            }
        });
        if (!category) {
            res.status(404).json({ message: 'No category found with this id.' });
            return;
        }
        res.status(200).json(category);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
