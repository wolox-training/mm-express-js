const { healthCheck } = require('./controllers/healthCheck');
const { createUser } = require('./controllers/users');
const { createUserSession } = require('./controllers/sessions');
const { validateUserEmailUniqueness } = require('./middlewares/users');
const { verifyUserPresence } = require('./middlewares/sessions');
const { schemaValidation } = require('./middlewares/fields_validation');
const { userCreationSchema } = require('./schemas/users');
const { sessionsCreationSchema } = require('./schemas/sessions');

exports.init = app => {
  app.get('/health', healthCheck);
  app.post('/users', [schemaValidation(userCreationSchema), validateUserEmailUniqueness], createUser);
  app.post(
    '/users/sessions',
    [schemaValidation(sessionsCreationSchema), verifyUserPresence],
    createUserSession
  );
};
