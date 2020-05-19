const user = require('./user');
const session = require('./session');

module.exports = {
  ...user,
  ...session,
  error: {
    type: 'object',
    properties: {
      message: {
        type: 'string'
      },
      internal_code: {
        type: 'string'
      }
    }
  },
  fieldValidationError: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        example: 'first_name must be present'
      },
      internal_code: {
        type: 'string',
        example: 'field_validation_error'
      }
    }
  }
};
