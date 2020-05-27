const { encode, decode } = require('jwt-simple');

const {
  common: {
    session: { secret }
  }
} = require('../../config');

exports.encode = payload => encode({ ...payload, iss: Date.now() }, secret, 'HS256');

exports.decode = token => decode(token, secret);
