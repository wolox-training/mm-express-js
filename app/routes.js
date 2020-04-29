const { healthCheck } = require('./controllers/healthCheck');
const users = require('./controllers/users');

exports.init = app => {
  app.get('/health', healthCheck);
  app.post('/users', users.create);
};
