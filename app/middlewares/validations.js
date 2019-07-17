const { check, validationResult } = require('express-validator'),
  jwt = require('jsonwebtoken'),
  { invalidInputError, forbiddenError, unauthorizedError } = require('../errors'),
  secret = 'notasecrekey';

const paramValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    next();
  } else {
    next(invalidInputError(errors));
  }
};
const emailRegEx = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/;
const isValidEmail = email => emailRegEx.test(email);

exports.checkToken = (req, res, next) => {
  const token = req.headers.authorization;
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      throw forbiddenError(err.message);
    } else {
      req.decoded = decoded;
      next();
    }
  });
};

exports.userParamsValidations = [
  check('firstName')
    .exists()
    .withMessage('firstName required'),
  check('lastName')
    .exists()
    .withMessage('lastName required'),
  check('password')
    .isLength({ min: 8 })
    .withMessage('password must contain more than 8 characters'),
  check('email')
    .isEmail()
    .withMessage('invalid email')
    .custom(email => {
      if (!isValidEmail(email)) {
        throw new Error('Email is not valid');
      }
      return true;
    }),
  paramValidation
];

exports.sessionParamsValidations = [
  check('password')
    .isLength({ min: 8 })
    .withMessage('Password must contain more than 8 characters.'),
  check('email')
    .isEmail()
    .withMessage('invalid email')
    .custom(email => {
      if (!isValidEmail(email)) {
        throw new Error('Email is not valid');
      }
      return true;
    }),
  paramValidation
];

exports.adminValidations = (req, res, next) => {
  if (req.decoded.admin) {
    next();
  } else {
    throw unauthorizedError('You must be admin user for use this service');
  }
};
