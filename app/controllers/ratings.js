const { rateWeet } = require('../interactors/ratings');
const { showRatingSerializer } = require('../serializers/ratings');

exports.createRating = (req, res, next) =>
  rateWeet(req.body.weet, req.currentUser, req.body.score)
    .then(rating => res.status(201).send(showRatingSerializer(rating)))
    .catch(next);
