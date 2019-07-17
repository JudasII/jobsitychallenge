const express = require('express'),
    { createUser, login, getUsers, createUserAdmin } = require('./app/controllers/users'),
    { createPrivate,loginRoom,getAllRooms } = require('./app/controllers/chatroom'),
    {
      userParamsValidations,
      sessionParamsValidations,
      checkToken,
      adminValidations
    } = require('./app/middlewares/validations');
var app = express();
app.post('/users',userParamsValidations, createUser);
app.get('/users', checkToken, getUsers);
app.post('/users/sessions', sessionParamsValidations, login);
app.post('/admin/users', [checkToken, adminValidations, userParamsValidations], createUserAdmin);
app.post('/chat/createPrivate', [checkToken,adminValidations], createPrivate);
app.get('/chat', checkToken, getAllRooms );
app.post('/chat/login', checkToken, loginRoom)


app.listen(8080);
console.log('listening to port 8080');
module.exports = app;

