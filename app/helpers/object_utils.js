const _ = require('lodash');

const mapValue = (value, mapper) => {
  if (_.isArray(value)) return value.map(e => exports.deepMapKeys(e, mapper));
  if (_.isObject(value)) return exports.deepMapKeys(value, mapper);
  return value;
};

exports.deepMapKeys = (object, mapper) =>
  _.reduce(object, (result, value, key) => ({ ...result, [mapper(key)]: mapValue(value, mapper) }), {});

exports.deepCamelizeKeys = object => exports.deepMapKeys(object, _.camelCase);

exports.deepUnderscoreKeys = object => exports.deepMapKeys(object, _.snakeCase);

exports.camelizeKeys = object => _.mapKeys(object, (value, key) => _.camelCase(key));

exports.underscoreKeys = object => _.mapKeys(object, (value, key) => _.snakeCase(key));
