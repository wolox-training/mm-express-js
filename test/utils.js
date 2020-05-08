const models = require('../app/models');

const tables = Object.values(models.sequelize.models);

exports.truncateTable = model =>
  model.destroy({ truncate: true, cascade: true, force: true, restartIdentity: true });

exports.truncateDatabase = () => Promise.all(tables.map(exports.truncateTable));
