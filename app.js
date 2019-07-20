const express = require('express'),
    { createUser, login, getUsers, createUserAdmin } = require('./app/controllers/users'),
    { createPrivate,loginRoom,getAllRooms,createPublic, findRoom } = require('./app/controllers/chatroom'),
    { sendMessage, findMessage, getMessages } = require('./app/controllers/message'),
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
app.post('/chat/createPubic', [checkToken,adminValidations], createPublic);
app.get('/chat', checkToken, getAllRooms );
app.get('/chat/find', checkToken, findRoom);
app.post('/chat/login', checkToken, loginRoom);
app.post('/messages/send', checkToken, sendMessage);
app.get('/messages/find', checkToken, findMessage);
app.get('/messages', checkToken, getMessages);



app.listen(8080);
console.log('listening to port 8080');
module.exports = app;

