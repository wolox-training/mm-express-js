const { findWeetById } = require('../services/weets');
const { resourceNotFoundError } = require('../errors');

exports.setWeetById = (req, res, next) =>
  findWeetById(req.params.id)
    .then(weet => {
      if (!weet) throw resourceNotFoundError(`Not found Weet with id: ${req.params.id}`);
      req.body.weet = weet;
      next();
    })
    .catch(next);
