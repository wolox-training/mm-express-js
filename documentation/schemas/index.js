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
  }
};
