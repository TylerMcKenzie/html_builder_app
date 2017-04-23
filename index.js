const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const morgan = require('morgan');
const path = require('path');

const port = process.env.PORT || 3000;

const app = express();

// Initialize passport config from passport file
require('./server/config/passport')(passport);

// Loggin req and res
app.use(morgan('dev'));

// Use body parser to get xhr req body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set view engine
app.set('view-engine', 'ejs');

// For auth with passport
app.use(cookieParser());

app.use(session({ secret: "supersecretkeyforapp", resave: false, saveUninitialized: false }));

// Initialize passport as middleware for authentication
app.use(passport.initialize());
// Setup passport session
app.use(passport.session());

// Use flash for login messages
app.use(flash());

// Use public folder for static assests * i.e. images, js, layouts
app.use(express.static(path.join(__dirname, 'public')));

// Add routes here
require('./server/routes')(app, passport);

app.listen(port)
