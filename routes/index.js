const private = require('./private');
const public = require('./public');
const login = require('./login');
const logout = require('./logout');
const signup = require('./signup');

const routerMethod = (app) => {

  app.use('/private', private);

  app.use('/signup', signup);

  app.use('/public', public);

  app.use('/login', login);

  app.use('/logout', logout);

  app.get('/', (req, res) => {

    if (req.session.user)  return res.redirect('/private');

    res.redirect('/public');

  })

  app.use('*', (req, res) => {
    res.status(404).redirect('/');
  });

};

module.exports = routerMethod;