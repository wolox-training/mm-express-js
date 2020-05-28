const { rateWeet } = require('../interactors/ratings');
const { findWeetById } = require('../services/weets');
const { showRatingSerializer } = require('../serializers/ratings');
const { weetNotFoundError } = require('../errors');

exports.createRating = (req, res, next) =>
  findWeetById(req.params.id)
    .then(weet => {
      if (!weet) throw weetNotFoundError(`Not found Weet with id: ${req.params.id}`);
      return rateWeet(weet, req.currentUser, req.body.score);
    })
    .then(rating => res.status(201).send(showRatingSerializer(rating)))
    .catch(next);
