const users = require('../../models/users'),
  errors = require('../errors'),
  bcrypt = require('bcrypt'),
  jwt = require('jsonwebtoken'),
  secret = 'notasecrekey';

exports.createUser = (req, res, next) =>
  users.createWithHashedPassword(req.query)
    .then(user => res.status(201).send(user))
    .catch(error => res.status(404).send(error.message));

exports.getUsers = (req, res, next) =>
  Users.getAll(req.query)
    .then(users => res.status(200).send(users))
    .catch(next);

exports.login = async (req, res, next) => {
  try {
    const user = await Users.findUser(req.query);
    if (user) {
      const matches = await bcrypt.compare(req.query.password, user.password);
      if (matches) {
        const token = jwt.sign({ email: user.email, admin: user.admin }, secret);
        res.status(201).send({
          message: 'Authentication successful!',
          token
        });
        return;
      }
    }
    logger.error('Incorrect username or password');
    throw errors.forbiddenError('Incorrect username or password');
  } catch (err) {
    next(err);
  }
};

exports.createUserAdmin = async (req, res, next) => {
  try {
    const user = await Users.findUser(req.query);
    let response = null;
    if (user) {
      response = await Users.update({ admin: true }, { where: { id: user.id } });
    } else {
      response = await Users.createWithHashedPassword({
        admin: true,
        ...req.query
      });
    }
    res.status(201).send(response);
  } catch (err) {
    next(err);
  }
};