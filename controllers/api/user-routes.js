// controllers/api/user-routes.js:
const router = require('express').Router();
const { User } = require('../../models');
const bcryptjs = require('bcryptjs');


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
        const validPassword = await bcryptjs.compare(req.body.password, userData.password);

        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect email or password, please try again' });
            return;
        }

        // Once the user successfully logs in, set up the sessions variable 'loggedIn'
        req.session.save(() => {
            req.session.userId = userData.id;
            req.session.logged_in = true;
            console.log('Session ID:', req.session.id, 'Session Data:', req.session);

            res.json({ user: userData, message: 'You are now logged in!' });
        });

    } catch (err) {
        res.status(400).json(err);
    }
});

// Logout route
router.post('/logout', (req, res) => {
    console.log('Cookies sent with request:', req.cookies); // This will log the cookies

    // Store session ID before destruction to log it afterwards
    const sessionId = req.session.id;

    if (req.session.logged_in) {
        req.session.destroy(() => {
            console.log('Logging out session ID:', sessionId); // Log the session ID

            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

// Registration route
router.post('/register', async (req, res) => {
    try {
        // Log the incoming request body
        console.log('Received data for registration:', req.body);

        const userData = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: await bcryptjs.hash(req.body.password, 10)
        });

        req.session.save(() => {
            req.session.userId = userData.id; // Corrected to match the login route
            req.session.logged_in = true;
            res.status(200).json({ user: userData, message: 'Registration successful!' });
        });
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ message: 'Username already in use. Please choose another.' });
        } else {
            console.error('Error during user registration:', err);
            res.status(400).json({ message: 'Unable to register', error: err });
        }
    }
});

module.exports = router;