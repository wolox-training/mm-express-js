const { healthCheck } = require('./controllers/healthCheck');
const { createUser } = require('./controllers/users');
const { createSession } = require('./controllers/sessions');
const { validateUserEmailUniqueness } = require('./middlewares/users');
const { schemaValidation } = require('./middlewares/fields_validation');
const { userCreationSchema } = require('./schemas/users');
const { sessionsCreationSchema } = require('./schemas/sessions');

exports.init = app => {
  app.get('/health', healthCheck);
  app.post('/users', [schemaValidation(userCreationSchema), validateUserEmailUniqueness], createUser);
  app.post('/users/sessions', [schemaValidation(sessionsCreationSchema)], createSession);
};
