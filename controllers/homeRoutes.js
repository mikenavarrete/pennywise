//homeRouter for GET requests and rendering pages -tb

//bringing in express packages for routes -tb
const router = require('express').Router()
//bringing in models -tb
const { User, Budget, Category } = require('../models')
//bringing in helper -tb
const withAuth = require('../utils/auth')


router.get('/', withAuth, (req, res) => {
    res.render('homepage', { loggedIn: req.session.loggedIn });
});

//renders the login page to the user
// if user is logged in they will go to their dashboard, otherwise they see the login page again
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/homepage');
    } else {
        res.render('/login');
    }
});


module.exports = router;