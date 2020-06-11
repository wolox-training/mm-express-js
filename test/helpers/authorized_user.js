const {
  common: {
    auth0: { audience, domain, roleNamespace }
  }
} = require('../../config');
const { createUser } = require('../factory/users_factory');

exports.authorizedUserWithToken = async ({ userParams, jwksMock }) => {
  const user = await createUser(userParams);
  return { user, token: this.tokenFromUser(user, jwksMock) };
};

exports.tokenFromUser = (user, jwksMock) =>
  jwksMock.token({
    aud: audience,
    iss: `https://${domain}/`,
    sub: user.externalId,
    [`${roleNamespace}/role`]: user.role
  });
