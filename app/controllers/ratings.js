const { rateWeet } = require('../interactors/ratings');

exports.createRating = (req, res, next) =>
  rateWeet(req.body.weet, req.currentUser, req.body.score)
    .then(rating => res.status(201).send(rating))
    .catch(next);
