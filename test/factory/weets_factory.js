const { factory } = require('factory-girl');

const { factoryByModel } = require('./factory_by_models');

const modelName = 'Weet';
factoryByModel(modelName);

const buildDefaultAttrs = params => ({
  ...params,
  content: params.content || factory.chance('sentence')
});

exports.createManyWeets = (count, defaultAttrs = {}, buildOptions = {}) =>
  factory.createMany(modelName, count, buildDefaultAttrs(defaultAttrs), buildOptions);

exports.createWeet = (defaultAttrs = {}, buildOptions = {}) =>
  factory.create(modelName, buildDefaultAttrs(defaultAttrs), buildOptions);
