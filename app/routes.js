const 
  { createUser, login, getUsers, createUserAdmin } = require('./controllers/users'),
  {
    userParamsValidations,
    sessionParamsValidations,
    checkToken,
    adminValidations
  } = require('./middlewares/validations');

exports.init = app => {
  app.post('/users', userParamsValidations, createUser);
  app.get('/users', checkToken, getUsers);
  app.post('/users/sessions', sessionParamsValidations, login);
  app.post('/admin/users', [checkToken, adminValidations, userParamsValidations], createUserAdmin);
};
