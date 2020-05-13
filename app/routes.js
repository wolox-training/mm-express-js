const { healthCheck } = require('./controllers/healthCheck');
const { createUserSession } = require('./controllers/sessions');
const { createUser, usersIndex } = require('./controllers/users');
const { validateUserEmailUniqueness } = require('./middlewares/users');
const { verifyUserPresence, verifyJwt } = require('./middlewares/sessions');
const { schemaValidation } = require('./middlewares/fields_validation');
const { userCreationSchema } = require('./schemas/users');
const { sessionsCreationSchema } = require('./schemas/sessions');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/users', [verifyJwt], usersIndex);
  app.post('/users', [schemaValidation(userCreationSchema), validateUserEmailUniqueness], createUser);
  app.post(
    '/users/sessions',
    [schemaValidation(sessionsCreationSchema), verifyUserPresence],
    createUserSession
  );
};
