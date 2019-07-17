const express = require('express'),
    { createUser, login, getUsers, createUserAdmin } = require('./app/controllers/users'),
    {
      userParamsValidations,
      sessionParamsValidations,
      checkToken,
      adminValidations
    } = require('./app/middlewares/validations');
var app = express();
app.post('/users', createUser);
app.get('/users', checkToken, getUsers);
app.post('/users/sessions', sessionParamsValidations, login);
app.post('/admin/users', [checkToken, adminValidations, userParamsValidations], createUserAdmin);

app.listen(8080);
console.log('listening to port 8080');
module.exports = app;

