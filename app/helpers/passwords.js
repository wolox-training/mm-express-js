const { hash } = require('bcrypt');

exports.hashPassword = password => {
  const saltRounds = 10;
  return hash(password, saltRounds);
};
