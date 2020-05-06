const { encode } = require('jwt-simple');

const {
  common: {
    session: { secret }
  }
} = require('../../config');

exports.encode = payload => encode(payload, secret, 'HS256');
