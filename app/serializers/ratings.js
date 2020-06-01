const { pick } = require('lodash');

const { underscoreKeys } = require('../helpers/object_utils');

exports.showRatingSerializer = rating =>
  underscoreKeys(pick(rating, 'id', 'score', 'ratingUserId', 'weetId'));
