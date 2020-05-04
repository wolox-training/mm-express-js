const { validationResult } = require('express-validator');

const { fieldValidationError } = require('../errors');

exports.fieldErrorsValidation = validations => (req, res, next) => {
  Promise.all(validations.map(validation => validation.run(req)))
    .then(() => {
      const errors = validationResult(req);
      if (errors.isEmpty()) return next();
      throw fieldValidationError(errors.mapped());
    })
    .catch(next);
};
