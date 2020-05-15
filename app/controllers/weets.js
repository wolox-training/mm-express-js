const { createWeet } = require('../services/weets');
const { showWeetSerializer } = require('../serializers/weets');

exports.createWeet = (req, res, next) =>
  createWeet(req.body.content, req.currentUser)
    .then(weet => res.status(201).send(showWeetSerializer(weet)))
    .catch(next);
