const { getRandomJoke } = require('../services/jokes');
const { createWeet } = require('../services/weets');
const { showWeetSerializer } = require('../serializers/weets');

exports.createWeet = (req, res, next) =>
  getRandomJoke()
    .then(joke => createWeet(joke, req.currentUser))
    .then(weet => res.status(201).send(showWeetSerializer(weet)))
    .catch(next);
