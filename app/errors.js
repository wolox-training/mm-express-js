const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.DATABASE_ERROR = 'database_error';
exports.databaseError = message => internalError(message, exports.DATABASE_ERROR);

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

exports.EXTERNAL_SERVICE_ERROR = 'external_service_error';
exports.externalServiceError = message => internalError(message, exports.EXTERNAL_SERVICE_ERROR);

exports.VALIDATION_ERROR = 'validation_error';
exports.sequelizeValidationError = sequelizeError => {
  const message = sequelizeError.errors.map(error => error.message).join(', ');
  return internalError(message, exports.VALIDATION_ERROR);
};
