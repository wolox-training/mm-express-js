const { findOrCreateRating, updateRatingScore } = require('../services/ratings');
const { modifyUserPointsBy } = require('../services/users');
const { sequelize } = require('../models');

const revertRating = ({ ratedUser, rating, newScore }, transaction) => {
  const oldScore = rating.score;
  const modifyBy = newScore - oldScore;
  return Promise.all([
    updateRatingScore(rating, newScore, transaction),
    modifyUserPointsBy(ratedUser, modifyBy, transaction)
  ]);
};

exports.rateWeet = (weet, user, score) =>
  sequelize.transaction(async transaction => {
    const [rating, created] = await findOrCreateRating({ score, weet, user }, transaction);
    const { user: ratedUser } = weet;
    if (created) {
      await modifyUserPointsBy(ratedUser, rating.score, transaction);
    } else if (score !== rating.score) {
      await revertRating({ ratedUser, rating, newScore: score }, transaction);
    }
    return rating;
  });
