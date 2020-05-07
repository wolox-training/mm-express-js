const { healthCheck } = require('./controllers/healthCheck');
const { createUser } = require('./controllers/users');
const { createSession } = require('./controllers/sessions');

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
