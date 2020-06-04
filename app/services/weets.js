const {
  Weet,
  User,
  Sequelize: { Op },
  sequelize
} = require('../models');
const { info } = require('../logger');
const { databaseError } = require('../errors');

exports.createWeet = (content, user) => {
  info('weets.createWeet: Creating weet');
  return Weet.create({ content, userId: user.id }).catch(error => {
    throw databaseError(error.message);
  });
};

exports.findAndCountAllWeets = ({ offset, limit }) => {
  info('Calling weets.findAndCountAllWeets');
  return Weet.findAndCountAll({ offset, limit, order: [['id', 'asc']] }).catch(error => {
    throw databaseError(error.message);
  });
};

exports.findWeetById = id => {
  info('Calling weets.findWeetById');
  return Weet.findByPk(id, { include: { model: User, as: 'user' } }).catch(error => {
    throw databaseError(error.message);
  });
};

exports.wordsCountByUser = ({ startingDate, limit }) => {
  info(`Calling weets.wordsCountByUser with startingDate=${startingDate}`);
  return Weet.findAll({
    where: {
      createdAt: {
        [Op.gte]: startingDate
      }
    },
    attributes: [
      [
        sequelize.fn(
          'sum',
          sequelize.fn(
            'array_length',
            sequelize.fn('regexp_split_to_array', sequelize.col('content'), sequelize.literal("E'\\\\s+'")),
            1
          )
        ),
        'totalWordsCount'
      ]
    ],
    include: { model: User, as: 'user', required: true },
    group: ['user.id'],
    order: [[sequelize.literal('"totalWordsCount"'), 'DESC']],
    limit
  }).catch(({ message }) => {
    throw databaseError(message);
  });
};
