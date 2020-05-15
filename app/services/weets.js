const { Weet } = require('../models');

exports.createWeet = (content, user) => {
  const weet = Weet.build({ content });
  weet.setUser(user, { save: false });
  return weet.save();
};
