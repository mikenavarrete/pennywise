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

router.get('/dashboard', withAuth, (req, res) => {
        //fixed logged_in syntax
    console.log(req.session)
    if (req.session.logged_in) {
        //corrected the rendering redirect by making it go to the dashbaord.handlebars by removing the '/' -tb
        res.render('dashboard');
    } else {
        //added '/' to the user gets redirected to the login page if they are not logged in -tb
        res.redirect('/login');
    }
});



module.exports = router;

