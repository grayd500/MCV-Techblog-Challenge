// controllers/api/user-routes.js:
const router = require('express').Router();
const { User } = require('../../models');
const bcrypt = require('bcrypt');

// Login route
router.post('/login', async (req, res) => {
    try {
        // Find the user who matches the posted email address
        const userData = await User.findOne({ where: { email: req.body.email } });

        if (!userData) {
            res.status(400).json({ message: 'Incorrect email or password, please try again' });
            return;
        }

        // Verify the posted password with the password stored in the database
        const validPassword = await bcrypt.compare(req.body.password, userData.password);

        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect email or password, please try again' });
            return;
        }

        // Once the user successfully logs in, set up the sessions variable 'loggedIn'
        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;
            
            res.json({ user: userData, message: 'You are now logged in!' });
        });

    } catch (err) {
        res.status(400).json(err);
    }
});

// Logout route
router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

// Registration route
router.post('/register', async (req, res) => {
    try {
        const userData = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 10) // Hash password
        });

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;
            res.status(200).json({ user: userData, message: 'Registration successful!' });
        });
    } catch (err) {
        // This will catch if the email or username is already taken, as well as other errors
        res.status(400).json({ message: 'Unable to register', error: err });
    }
});

module.exports = router;