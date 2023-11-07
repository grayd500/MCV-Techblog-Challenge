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
});

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