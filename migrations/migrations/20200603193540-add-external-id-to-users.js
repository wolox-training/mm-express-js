'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('users', 'externalId', {
      type: Sequelize.STRING,
      allowNull: false
    }),
  down: queryInterface => queryInterface.removeColumn('users', 'externalId')
};
