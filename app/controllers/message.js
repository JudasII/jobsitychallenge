const { Message } = require('../../models'),
  errors = require('../errors');

exports.getMessages = (req, res, next) =>
  Message.getAll(req.query)
    .then(users => res.status(200).send(users))
    .catch(next);

exports.sendMessage = (req, res, next) =>
    Message.send(req.query)
     .then(message => res.status(201).send(message))
     .catch(next);
     
exports.findMessage = (req, res, next) =>
    mesasge.findMessage(req.query)
     .then(messages => res.status(200).send(messages))
     .catch(next);

