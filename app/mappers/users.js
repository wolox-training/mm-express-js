const _ = require('lodash');

const { deepCamelizeKeys } = require('../helpers/object_utils');

exports.creationParamsMapper = params => {
  const filteredParams = _.pick(params, 'first_name', 'last_name', 'email', 'external_id');
  console.log(filteredParams);
  return deepCamelizeKeys(filteredParams);
};
