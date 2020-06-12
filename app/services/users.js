const {
  Weet,
  User,
  Sequelize: { Op },
  sequelize
} = require('../models');
const { databaseError } = require('../errors');
const { info } = require('../logger');

exports.createUser = userParams => {
  info('Calling users.createUser');
  return User.create(userParams).catch(error => {
    throw databaseError(error.message);
  });
};

exports.findUserByEmail = email => {
  info('Calling users.findUserByEmail');
  return User.findOne({ where: { email } }).catch(error => {
    throw databaseError(error.message);
  });
};

exports.findAndCountAllUsers = ({ offset, limit }) => {
  info('Calling users.findAndCountAllUsers');
  return User.findAndCountAll({ offset, limit, order: [['id', 'asc']] }).catch(error => {
    throw databaseError(error.message);
  });
};

exports.upgradeUserToAdmin = user =>
  user.update({ role: 'admin' }).catch(error => {
    throw databaseError(error.message);
  });

exports.userJobPosition = ({ points }) => {
  if (points <= 5) return 'DEVELOPER';
  if (points <= 9) return 'LEAD';
  if (points <= 19) return 'TL';
  if (points <= 29) return 'EM';
  if (points <= 49) return 'HEAD';
  return 'CEO';
};

exports.modifyUserPointsBy = (user, by, transaction) => {
  info(`Calling users.modifyUserPointsBy: userId=${user.id}, by=${by}`);
  return user.increment('points', { by, transaction }).catch(error => {
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

exports.invalidateUserSessions = user => {
  info(`Calling users.invalidateUserSessions for user ${user.id}`);
  return user.update({ sessionsExpiredAt: Date.now() }).catch(error => {
    throw databaseError(error.message);
  });
};
