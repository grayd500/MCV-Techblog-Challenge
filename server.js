// server.js:
const express = require("express");
const session = require("express-session");
const routes = require("./controllers");
const exphbs = require("express-handlebars");
const path = require("path");
const sequelize = require("./config/config");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const dashboardRoutes = require('./controllers/dashboard-routes');
const homeRoutes = require('./controllers/home-routes');

const app = express();
const PORT = process.env.PORT || 3001;

const TEN_MINUTES = 1000 * 60 * 10;

const sess = {
  secret: "Super secret secret",
  cookie: {
    maxAge: TEN_MINUTES // this will set the cookie to expire after idle time of 10 minutes
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
    checkExpirationInterval: 15 * 60 * 1000, // The interval at which to cleanup expired sessions in milliseconds.
    expiration: 24 * 60 * 60 * 1000  // The maximum age (in milliseconds) of a valid session. 
  }),
};

// route for logout
app.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(() => {
      res.redirect('/login'); // Redirect to login after logout
    });
  } else {
    res.redirect('/login'); // Redirect to login even if there was no active session
  }
});

app.use(session(sess));
app.use((req, res, next) => {
  res.locals.loggedIn = req.session.logged_in || false;
  console.log('Session ID:', req.session.id, 'Session Data:', req.session);
  next();
});

const hbs = exphbs.create({
  helpers: require('./utils/helpers'), // include your helpers here
});

app.use('/', homeRoutes);
app.use('/dashboard', dashboardRoutes);
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/dashboard', dashboardRoutes);
app.use(routes);
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log("Now listening"));
});