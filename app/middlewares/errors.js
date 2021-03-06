const errors = require('../errors');
const logger = require('../logger');

const DEFAULT_STATUS_CODE = 500;

const statusCodes = {
  [errors.DATABASE_ERROR]: 503,
  [errors.DEFAULT_ERROR]: 500,
  [errors.EXTERNAL_SERVICE_ERROR]: 502,
  [errors.FIELD_VALIDATION_ERROR]: 422,
  [errors.USER_EMAIL_REPEATED_ERROR]: 422,
  [errors.INVALID_LOGIN_ERROR]: 401,
  [errors.AUTHORIZATION_ERROR]: 401,
  [errors.WEET_LENGTH_EXCEEDED]: 502,
  [errors.PERMISSIONS_ERROR]: 403,
  [errors.WEET_NOT_FOUND_ERROR]: 404
};

exports.handle = (error, req, res, next) => {
  if (error.internalCode) res.status(statusCodes[error.internalCode] || DEFAULT_STATUS_CODE);
  else {
    // Unrecognized error, notifying it to rollbar.
    next(error);
    res.status(DEFAULT_STATUS_CODE);
  }
  logger.error(error);
  return res.send({ message: error.message, internal_code: error.internalCode });
};
