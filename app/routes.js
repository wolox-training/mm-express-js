const { healthCheck } = require('./controllers/healthCheck');
const { createUser } = require('./controllers/users');

exports.init = app => {
  app.get('/health', healthCheck);
  app.post('/users', createUser);
};
