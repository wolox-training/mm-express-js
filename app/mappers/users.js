const _ = require('lodash');

const { deepCamelizeKeys } = require('../helpers/objectUtils');

exports.creationParamsMapper = params => {
  const filteredParams = _.pick(params, 'first_name', 'last_name', 'password', 'email');
  return deepCamelizeKeys(filteredParams);
};
