const { getRandomJoke } = require('../services/jokes');
const { weetLengthExceeded } = require('../errors');

exports.setWeetContent = (req, res, next) =>
  getRandomJoke()
    .then(joke => {
      if (joke.length > 140) throw weetLengthExceeded('Weet is longer than 140 characters');
      req.body.content = joke;
      next();
    })
    .catch(next);
