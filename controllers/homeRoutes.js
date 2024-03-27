//homeRouter for GET requests and rendering pages -tb

//bringing in express packages for routes -tb
const router = require('express').Router()
//bringing in models -tb
const { User, Budget, Category } = require('../models')
//bringing in helper -tb
const withAuth = require('../utils/auth')


router.get('/', withAuth, (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/dashboard');
    } else {
        res.render('login');
    }
});

//renders the login page to the user
// if user is logged in they will go to their dashboard, otherwise they see the login page again
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/dashboard');
    } else {
        res.render('login'); 
    }
});

router.get('/dashboard', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/dashboard');
    } else {
        res.render('login'); 
    }
});


module.exports = router;