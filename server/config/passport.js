const User = require('../models').User;
const LocalStrategy = require('passport-local').Strategy;

module.exports = passport => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id)
    .then(user => {
      done(null, user);
    })
    .catch(err => {
      done(err);
    })
  });

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, email, password, done) {
    User.findOne({
      where: {
        email: email
      }
    })
    .then((user) => {
      if(user) {
        done(null, false, req.flash('signupMessage', 'That email already exists.'))
      } else {
        let newUser = User.build();

        newUser.email = email;
        newUser.password = newUser.generateHash(password);

        newUser.save()
        .then(user => {
          done(null, user);
        })
        .catch(err => {console.log(err)})
      }
    })
    .catch(err => {console.log(err)})
  }));

  passport.use('local-signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, email, password, done) {
    User.findOne({
      where: {
        email: email
      }
    })
    .then(user => {
      if(!user) {
        return done(null, false, req.flash('signinMessage', 'No user found.'))
      }

      if(!user.validPassword(password)) {
        return done(null, false, req.flash('signinMessage', 'Invalid password.'))
      }

      done(null, user);
    })
    .catch(err => {console.log(err)})
  }));
};
