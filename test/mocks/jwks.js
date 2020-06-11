const createJWKSMock = require('mock-jwks').default;

const {
  common: {
    auth0: { domain }
  }
} = require('../../config');

exports.mockJwks = () => createJWKSMock(`https://${domain}/`);
