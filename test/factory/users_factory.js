const { factory } = require('factory-girl');
const _ = require('lodash');

const { factoryByModel } = require('./factory_by_models');
const { deepUnderscoreKeys } = require('../../app/helpers/object_utils');

const modelName = 'User';
factoryByModel(modelName);

exports.createUser = (defaultAttrs, buildOptions) => factory.create(modelName, defaultAttrs, buildOptions);

exports.buildUserJson = (defaultAttrs, buildOptions) =>
  factory
    .attrs(modelName, defaultAttrs, buildOptions)
    .then(attrs => deepUnderscoreKeys(_.omit(attrs, 'createdAt', 'updatedAt')));
