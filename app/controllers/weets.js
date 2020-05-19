const { getRandomJoke } = require('../services/jokes');
const { createWeet, findAndCountAllWeets } = require('../services/weets');
const { paginationParamsMapper } = require('../mappers/pagination_params');
const { showWeetSerializer, weetsPageSerializer } = require('../serializers/weets');
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

exports.weetsIndex = (req, res, next) =>
  findAndCountAllWeets(paginationParamsMapper(req.query))
    .then(page => res.status(200).send(weetsPageSerializer(page)))
    .catch(next);
