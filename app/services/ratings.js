const { Rating } = require('../models');
const { databaseError } = require('../errors');
const { info } = require('../logger');

exports.findOrCreateRating = ({ score, user, weet }, transaction) => {
  info(`Calling ratings.findOrCreate rating with user_id: ${user.id}, weet_id: ${weet.id}`);
  return Rating.findOrCreate({
    where: { ratingUserId: user.id, weetId: weet.id },
    defaults: { score },
    transaction
  }).catch(error => {
    throw databaseError(error.message);
  });
};

exports.updateRatingScore = (rating, score, transaction) => {
  info(`Calling ratings.updateRatingScore rating_id=${rating.id}, score=${score}`);
  return rating.update({ score }, { transaction }).catch(error => {
    throw databaseError(error.message);
  });
};
