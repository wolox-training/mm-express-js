const { validationResult } = require('express-validator');

const { fieldValidationError } = require('../errors');

exports.fieldErrorsValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw fieldValidationError(errors.mapped());
  next();
};
