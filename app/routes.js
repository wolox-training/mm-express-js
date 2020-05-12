const { healthCheck } = require('./controllers/healthCheck');
const { createUser } = require('./controllers/users');
const { userBodyValidations, validateUserEmailUniqueness } = require('./middlewares/users');

exports.init = app => {
  app.get('/health', healthCheck);
  app.post('/users', [userBodyValidations, validateUserEmailUniqueness], createUser);
};
