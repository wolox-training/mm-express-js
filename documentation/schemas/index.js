const user = require('./user');
const session = require('./session');
const rating = require('./rating');
const weet = require('./weet');

module.exports = {
  ...user,
  ...session,
  ...weet,
  ...rating,
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
  },
  authorizationError: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        example: 'You need to be logged in'
      },
      internal_code: {
        type: 'string',
        example: 'authorization_error'
      }
    }
  }
};
