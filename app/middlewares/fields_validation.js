const { validationResult } = require('express-validator');

const { fieldValidationError } = require('../errors');

const buildErrorMessage = errors =>
  errors
    .array()
    .map(error => error.msg)
    .join('; ');

exports.fieldsValidation = (...validations) => (req, res, next) => {
  Promise.all(validations.flat().map(validation => validation.run(req)))
    .then(() => {
      const errors = validationResult(req);
      if (errors.isEmpty()) return next();
      throw fieldValidationError(buildErrorMessage(errors));
    })
    .catch(next);
};
