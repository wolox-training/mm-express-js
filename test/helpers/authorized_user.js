const { encode } = require('../../app/helpers/jwt_utils');
const { createUser } = require('../factory/users_factory');

exports.authorizedUserWithToken = async userParams => {
  const user = await createUser(userParams);
  return { user, token: this.tokenFromUser(user) };
};

exports.tokenFromUser = user => encode({ sub: user.email });
