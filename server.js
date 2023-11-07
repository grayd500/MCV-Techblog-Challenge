// server.js:
const express = require("express");
const session = require("express-session");
const routes = require("./controllers");
const exphbs = require("express-handlebars");
const path = require("path");
const sequelize = require("./config/config");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const dashboardRoutes = require('./controllers/dashboard-routes');

const app = express();
const PORT = process.env.PORT || 3001;

const sess = {
  secret: "Super secret secret",
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));

app.use((req, res, next) => {
  res.locals.loggedIn = req.session.logged_in || false;
  console.log('Session ID:', req.session.id, 'Session Data:', req.session);
  next();
});

const hbs = exphbs.create({
  /* config */
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Use routes
app.use('/dashboard', dashboardRoutes);
app.use(routes);

// Sync Sequelize models to the database, then start the server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log("Now listening"));
});