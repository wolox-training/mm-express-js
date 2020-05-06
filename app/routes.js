const { healthCheck } = require('./controllers/healthCheck');
const { createUser, createSession } = require('./controllers/users');
const {
  userBodyValidations,
  validateUserEmailUniqueness,
  sessionsBodyValidations
} = require('./middlewares/users');

exports.init = app => {
  app.get('/health', healthCheck);
  app.post('/users', [userBodyValidations, validateUserEmailUniqueness], createUser);
  app.post('/users/sessions', [sessionsBodyValidations], createSession);
};
