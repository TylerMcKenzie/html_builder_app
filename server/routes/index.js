const controllers = require('../controllers');
const path = require('path');

const componentsController = controllers.components;
const layoutsController = controllers.layouts;
const userController = controllers.users;

const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/');
  }
}

module.exports = (app, passport) => {

  // Signin Index
  app.get('/', (req, res) => {
    const signinMsg = req.flash('signinMessage');

    res.render(path.join(__dirname, '../views/index.ejs'), { signinMessage: signinMsg });
  });

  // Signup route
  app.get('/signup', (req, res) => {
    const signupMsg = req.flash('signupMessage');

    res.render(path.join(__dirname, '../views/signup-page.ejs'), { signupMessage: signupMsg });
  });

  // User Routes

  // Create User
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/app',
    failureRedirect: '/',
    failureFlash: true
  }));
  // Login User
  app.post('/signin', passport.authenticate('local-signin', {
    successRedirect: '/app',
    failureRedirect: '/',
    failureFlash: true
  }));
  // Logout User
  app.get('/signout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  // Component Routes

  // Create Component
  app.post('/components', componentsController.create);
  // Return all Components
  app.get('/components', componentsController.list);
  // Return single Component
  app.get('/components/:id', componentsController.retrieve);
  // Edit a Component
  app.put('/components/:id', componentsController.update);
  // Delete a Component
  app.delete('/components/:id', componentsController.delete);

  // Layout Routes

  // Create Layout
  app.post('/layouts', layoutsController.create);
  // Return all Layouts
  app.get('/layouts', layoutsController.list);
  // Return single Layout
  app.get('/layouts/:id', layoutsController.retrieve);
  // Edit a Layout
  app.put('/layouts/:id', layoutsController.update);
  // Delete a Layout
  app.delete('/layouts/:id', layoutsController.delete);


  // App page
  app.get('/*', isLoggedIn, (req, res, err) => {
    res.render(path.join(__dirname, '../views/app.ejs'), {user: req.user})
  });

}
