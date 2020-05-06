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

exports.FIELD_VALIDATION_ERROR = 'field_validation_error';
exports.fieldValidationError = message => internalError(message, exports.FIELD_VALIDATION_ERROR);

exports.USER_EMAIL_REPEATED_ERROR = 'user_email_repeated_error';
exports.userEmailRepeatedError = message => internalError(message, exports.USER_EMAIL_REPEATED_ERROR);

exports.INVALID_LOGIN_ERROR = 'invalid_login_error';
exports.invalidLoginError = message => internalError(message, exports.INVALID_LOGIN_ERROR);
