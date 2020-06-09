'use strict';

module.exports = {
  up: queryInterface => queryInterface.addIndex('users', ['external_id'], { unique: true }),
  down: queryInterface => queryInterface.removeIndex('users', ['external_id'])
};
