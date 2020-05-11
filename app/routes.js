const { healthCheck } = require('./controllers/healthCheck');
const { createUser } = require('./controllers/users');
const { validateUserEmailUniqueness } = require('./middlewares/users');
const { userCreationSchema } = require('./schemas/users');
const { schemaValidation } = require('./middlewares/fields_validation');
const { sessionsBodyValidations } = require('./middlewares/sessions');
const { createSession } = require('./controllers/sessions');

exports.init = app => {
  app.get('/health', healthCheck);
  app.post('/users', [schemaValidation(userCreationSchema), validateUserEmailUniqueness], createUser);
  app.post('/users/sessions', [sessionsBodyValidations], createSession);
};
