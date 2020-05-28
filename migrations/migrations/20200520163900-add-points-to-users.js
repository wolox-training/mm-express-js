'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('users', 'points', {
      type: Sequelize.INTEGER,
      defaultValue: '0',
      allowNull: false
    }),

  down: queryInterface => queryInterface.removeColumn('users', 'points')
};
