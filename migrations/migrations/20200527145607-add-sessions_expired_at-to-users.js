'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('users', 'sessions_expired_at', {
      type: Sequelize.DATE,
      allowNull: true
    }),
  down: queryInterface => queryInterface.removeColumn('users', 'sessions_expired_at')
};
