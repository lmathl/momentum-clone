module.exports = function(app) {
  const User = require('../models/userModel.js');
  const UserSession = require('../models/userSession');
    
  app.post('/signup', (req, res, next) => {
    const { body } = req;
    const { password } = body;
    let { email } = body;

    if (!email) {
      return res.send({
        success: false,
        message: 'Email cannot be blank.'
      });
    }
    if (!password) {
      return res.send({
        success: false,
        message: 'Password cannot be blank.'
      });
    }

    email = email.toLowerCase();
    email = email.trim();

    User.find({
      email: email
    }, (err, previousUsers) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Server error'
        });
      } else if (previousUsers.length > 0) {
        return res.send({
          success: false,
          message: 'Account already exist.'
        });
      }

      const newUser = new User();
      newUser.email = email;
      newUser.password = newUser.generateHash(password);
      newUser.save((err, user) => {
        if (err) {
          return res.send({
            success: false,
            message: 'Server error'
          });
        }
        return res.send({
          success: true,
          message: 'You have successfully signed up. Please click log in.'
        });
      });
    });

  });

  app.post('/signin', (req, res, next) => {
    const { body } = req;
    const { password } = body;
    let { email } = body;

    if (!email) {
      return res.send({
        success: false,
        message: 'Email cannot be blank.'
      });
    }
    if (!password) {
      return res.send({
        success: false,
        message: 'Password cannot be blank.'
      });
    }

    email = email.toLowerCase();
    email = email.trim();

    User.find({
      email: email
    }, (err, users) => {
      if (err) {
        console.log('err:', err);
        return res.send({
          success: false,
          message: 'Error: server error'
        });
      }
      if (users.length != 1) {
        return res.send({
          success: false,
          message: 'Incorrect email'
        });
      }

      const user = users[0];
      if (!user.validPassword(password)) {
        return res.send({
          success: false,
          message: 'Incorrect password'
        });
      }

      // Otherwise correct user
      req.session.userId = user._id;
      req.session.save();
      const userSession = new UserSession();
      userSession.userId = user._id;
      userSession.save((err, doc) => {
        if (err) {
          console.log(err);
          return res.send({
            success: false,
            message: 'Error: server error'
          });
        }
        return res.send({
          success: true,
          message: 'You are now logged in.',
          token: doc._id,
          userId: req.session.userId
        });
      });
    });
  });

  app.get('/verify', (req, res, next) => {
    const { query } = req;
    const { token } = query;
    UserSession.find({
      _id: token,
      isDeleted: false
    }, (err, sessions) => {
      if (err) {
        console.log(err);
        return res.send({
          success: false,
          message: 'Error: Server error'
        });
      }
      if (sessions.length != 1) {
        return res.send({
          success: false,
          message: 'Error: Invalid'
        });
      } else {
        return res.send({
          success: true,
          message: 'Good'
        });
      }
    });
  });

  app.get('/logout', (req, res, next) => {
    console.log(req.session.userId);
    const { query } = req;
    const { token } = query;
    UserSession.findOneAndUpdate({
      _id: token,
      isDeleted: false
    }, {
        isDeleted:true
    }, null, (err, sessions) => {
      if (err) {
        console.log(err);
        return res.send({
          success: false,
          message: 'Error: Server error'
        });
      }
      return res.send({
        success: true,
        message: 'Good'
      });
    });
  });

}