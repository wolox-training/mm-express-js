const { validationResult, checkSchema } = require('express-validator');

const { fieldValidationError } = require('../errors');

const buildErrorMessage = errors =>
  errors
    .array()
    .map(error => error.msg)
    .join('; ');

exports.schemaValidation = schema => [
  checkSchema(schema),
  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();
    throw fieldValidationError(buildErrorMessage(errors));
  }
];
