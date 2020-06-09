'use strict';

module.exports = {
  up: queryInterface => queryInterface.removeColumn('users', 'sessions_expired_at'),
  down: (queryInterface, Sequelize) =>
    queryInterface.addColumn('users', 'sessions_expired_at', {
      type: Sequelize.DATE,
      allowNull: true
    })
};
