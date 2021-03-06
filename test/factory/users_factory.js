const { factory } = require('factory-girl');
const _ = require('lodash');

const { factoryByModel } = require('./factory_by_models');
const { deepUnderscoreKeys } = require('../../app/helpers/object_utils');

const modelName = 'User';
factoryByModel(modelName);

const generateEmail = () => factory.seq('User.email', n => `user${n}@wolox.com.ar`);

const buildDefaultAttrs = params => ({
  ...params,
  email: params.email || generateEmail(),
  password: params.password || factory.chance('string', { length: 10 }),
  points: Number(params.points) || 0,
  sessionsExpiredAt: params.sessionsExpiredAt || null
});

exports.createUser = (defaultAttrs = {}, buildOptions = {}) =>
  factory.create(modelName, buildDefaultAttrs(defaultAttrs), buildOptions);

exports.createManyUsers = (count, defaultAttrs = {}, buildOptions = {}) =>
  factory.createMany(modelName, count, buildDefaultAttrs(defaultAttrs), buildOptions);

exports.buildUserJson = (defaultAttrs = {}, buildOptions = {}) =>
  factory
    .attrs(modelName, buildDefaultAttrs(defaultAttrs), buildOptions)
    .then(attrs => deepUnderscoreKeys(_.omit(attrs, 'createdAt', 'updatedAt')));
