//homeRouter for GET requests and rendering pages -tb

//bringing in express packages for routes -tb
const router = require('express').Router()
//bringing in models -tb
const { User, Budget, Category } = require('../models')
//bringing in helper -tb
const withAuth = require('../utils/auth')


router.get('/', withAuth, (req, res) => {
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

//added async, await and try. Added budget data to be fetched when user is logged in which will
//pull the users category and budget. 
router.get('/dashboard', withAuth, async (req, res) => {
    console.log(req.session)
    if (req.session.logged_in) {
        try {
            //finds all budget data for the user under their username and session
            const budgetData = await Budget.findAll({
                where: {
                    user_id: req.session.user_id
                },
                include: [
                    {
                        //includes data from categories
                        model: Category,
                        as: 'category'
                    }
                ]
            })
            //variable that will help rendering the data to the page
            const budgets = budgetData.map(budget => budget.get({ plain: true }))

        //render the dashboard with the users budget and category information
        res.render('dashboard', {
            budgets,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        console.error(err);
        res.status(500).json(err)
    }
} else {
    //if user is not logged in they will be redirected to login page
    res.redirect('/login');
}
});



module.exports = router;

