'use strict';
const tableName = 'ratings';
module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface
      .createTable(tableName, {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        rating_user_id: {
          type: Sequelize.INTEGER,
          references: {
            model: 'users',
            key: 'id'
          },
          onUpdate: 'cascade',
          onDelete: 'cascade'
        },
        weet_id: {
          type: Sequelize.INTEGER,
          references: {
            model: 'weets',
            key: 'id'
          },
          allowNull: false,
          onUpdate: 'cascade',
          onDelete: 'cascade'
        },
        score: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE
        }
      })
      .then(() =>
        queryInterface.addConstraint(tableName, {
          fields: ['score'],
          type: 'check',
          where: {
            score: [-1, 1]
          }
        })
      ),
  down: queryInterface => queryInterface.dropTable(tableName)
};
