const { createWeet } = require('../services/weets');
const { showWeetSerializer } = require('../serializers/weets');
const { getRandomJoke } = require('../services/jokes');
const { weetLengthExceeded } = require('../errors');

exports.createWeet = (req, res, next) =>
  getRandomJoke()
    .then(joke => {
      if (joke.length > 140) throw weetLengthExceeded('Weet is longer than 140 characters');
      return joke;
    })
    .then(joke => createWeet(joke, req.currentUser))
    .then(weet => res.status(201).send(showWeetSerializer(weet)))
    .catch(next);
