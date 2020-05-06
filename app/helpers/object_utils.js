const _ = require('lodash');

const camelizeValue = value => {
  if (_.isArray(value)) return value.map(this.deepCamelizeKeys);
  if (_.isObject(value)) return this.deepCamelizeKeys(value);
  return value;
};

exports.deepCamelizeKeys = object =>
  _.reduce(object, (result, value, key) => ({ ...result, [_.camelCase(key)]: camelizeValue(value) }), {});

exports.underscoreKeys = object => _.mapKeys(object, (value, key) => _.snakeCase(key));
