// server.js:
// Importing required modules and libraries
const express = require("express");
const session = require("express-session");
const routes = require("./controllers");
const exphbs = require("express-handlebars");
const path = require("path");
const sequelize = require("./config/config");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const dashboardRoutes = require('./controllers/dashboard-routes');
const homeRoutes = require('./controllers/home-routes');

// Initializing the express application
const app = express();

// Setting the port for the application
const PORT = process.env.PORT || 3001;

// Constants for session configuration
const TEN_MINUTES = 1000 * 60 * 10;

// Session configuration settings
const sess = {
  secret: "Super secret secret",
  cookie: {
    maxAge: TEN_MINUTES // Cookie expiration time
  },
  resave: false, // Prevents resaving session if unmodified
  saveUninitialized: true, // Saves uninitialized session
  store: new SequelizeStore({
    db: sequelize, // Sequelize database
    checkExpirationInterval: 15 * 60 * 1000, // Interval to check for expired sessions
    expiration: 24 * 60 * 60 * 1000  // Session expiration time
  }),
};

// Logout route: Destroys session and redirects to login
app.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(() => {
      res.redirect('/login');
    });
  } else {
    res.redirect('/login'); 
  }
});

// Using session middleware with the configured settings
app.use(session(sess));

// Middleware to set 'loggedIn' variable for all routes
app.use((req, res, next) => {
  res.locals.loggedIn = req.session.logged_in || false;
  console.log('Session ID:', req.session.id, 'Session Data:', req.session);
  next(); // Proceed to next middleware/function
});

// Setting up Handlebars as the view engine with helpers
const hbs = exphbs.create({
  helpers: require('./utils/helpers'), // Helpers for Handlebars
});

// Registering routes for different parts of the application
app.use('/', homeRoutes);
app.use('/dashboard', dashboardRoutes);

// Configuring Handlebars as the template engine
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// Setting the directory for static files (like CSS, JS, images)
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse request bodies (form submissions)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Main routes from controllers
app.use(routes);

// Syncing the Sequelize models with the database, then starting the server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log("Now listening on port:", PORT));
});
