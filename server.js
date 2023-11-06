// server.js:
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');

const app = express();
const PORT = process.env.PORT || 3001;

const hbs = exphbs.create({ /* config */ });

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Session middleware setup here
app.use(session({
  secret: 'mySecretString!123', // Replace 'mySecretString!123' with your actual secret string
  resave: false,
  saveUninitialized: true,
  // ... other session options
}));

// Middleware to check if the user is logged in
function checkAuth(req, res, next) {
  if (req.session.loggedIn) {
    res.locals.loggedIn = true;
  } else {
    res.locals.loggedIn = false;
  }
  next();
}

// Use the checkAuth middleware
app.use(checkAuth);

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Routes
app.get('/', async (req, res) => {
  // Fetch blog posts from the database
  const blogPosts = []; // Replace with your actual code to fetch posts from the database

  // Render the 'home' template with blog posts data
  res.render('home', { blogPosts });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// This code does the following:
// Imports the express module.
// Initializes the express application.
// Sets the port to 3001, unless there is a port specified in the environment variable PORT.
// Creates a route handler for the root path ('/') that just sends a simple message to the browser.
// Tells the app to listen to the specified port and logs a message to the console once the server starts.