'use strict';

module.exports = {
  up: queryInterface => queryInterface.removeColumn('users', 'password'),
  down: (queryInterface, Sequelize) =>
    queryInterface.addColumn('users', 'password', {
      type: Sequelize.STRING,
      allowNull: false
    })
};
