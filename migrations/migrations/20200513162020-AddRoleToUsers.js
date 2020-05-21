'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('users', 'role', {
      type: Sequelize.ENUM('user', 'admin'), // eslint-disable-line new-cap
      defaultValue: 'user',
      allowNull: false
    }),

  down: queryInterface =>
    queryInterface.sequelize.transaction(transaction =>
      Promise.all([
        queryInterface.removeColumn('users', 'role', { transaction }),
        queryInterface.sequelize.query('DROP TYPE "enum_users_role";', { transaction })
      ])
    )
};
