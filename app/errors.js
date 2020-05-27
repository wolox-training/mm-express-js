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

exports.AUTHORIZATION_ERROR = 'authorization_error';
exports.authorizationError = message => internalError(message, exports.AUTHORIZATION_ERROR);

exports.WEET_LENGTH_EXCEEDED = 'weet_length_exceeded';
exports.weetLengthExceeded = message => internalError(message, exports.WEET_LENGTH_EXCEEDED);

exports.PERMISSIONS_ERROR = 'permissions_error';
exports.permisionsError = message => internalError(message, exports.PERMISSIONS_ERROR);

exports.RESOURCE_NOT_FOUND_ERROR = 'resource_not_found_error';
exports.resourceNotFoundError = message => internalError(message, exports.RESOURCE_NOT_FOUND_ERROR);
