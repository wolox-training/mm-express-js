'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('users', 'external_id', {
      type: Sequelize.STRING,
      allowNull: false
    }),
  down: queryInterface => queryInterface.removeColumn('users', 'external_id')
};
