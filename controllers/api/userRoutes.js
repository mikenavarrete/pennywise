const router = require('express').Router();
const { User } = require('../../models');

router.post('/', async (req, res) => {

    try {
        console.log(req.body);
        const userData = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });
        console.log({ userData });
        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;

            res.status(200).json(userData);
        });
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

router.post('/login', async (req, res) => {
    try {
        const userData = await User.findOne({ where: { email: req.body.email } });

        if (!userData) {
            res.status(400).json({ message: 'Incorrect email or password, please try again' });
            return;
        }

        const validPassword = await userData.checkPassword(req.body.password);

        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect email or password, please try again' });
            return;
        }

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;

            // Redirect to the dashboard route after login
            res.redirect('/dashboard');
        });

    } catch (err) {
        res.status(400).json(err);
    }
});

//Added the ability to have the user go right to the the dashboard after the sign up instead of having to go back to the login page
router.post('/signup', async (req, res) => {
    try {
        //creates a new user and saves their data and login information into the database
        const newUser = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });

        req.session.save(() => {
            req.session.user_id = newUser.id;
            req.session.logged_in = true;
            res.redirect('/dashboard');
        });
    } catch (err) {
        res.status(500).json(err);
    }
});



router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

module.exports = router;
