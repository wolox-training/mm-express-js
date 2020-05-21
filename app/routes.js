const { healthCheck } = require('./controllers/healthCheck');
const { createUserSession } = require('./controllers/sessions');
const { createUser, usersIndex, createAdminUser } = require('./controllers/users');
const { createWeet } = require('./controllers/weets');
const { validateUserEmailUniqueness, setUserByEmail, setCurrentUser } = require('./middlewares/users');
const { verifyUserPresence, verifyJwt, verifyAdmin } = require('./middlewares/sessions');
const { schemaValidation } = require('./middlewares/fields_validation');
const { userCreationSchema } = require('./schemas/users');
const { sessionsCreationSchema } = require('./schemas/sessions');
const { paginationParamsSchema } = require('./schemas/pagination_params');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/users', [schemaValidation(paginationParamsSchema), verifyJwt], usersIndex);
  app.post('/users', [schemaValidation(userCreationSchema), validateUserEmailUniqueness], createUser);
  app.post(
    '/users/sessions',
    [schemaValidation(sessionsCreationSchema), verifyUserPresence],
    createUserSession
  );
  app.post('/weets', [verifyJwt, setCurrentUser], createWeet);

  app.use('/admin', verifyJwt, verifyAdmin);
  app.post('/admin/users', [schemaValidation(userCreationSchema), setUserByEmail], createAdminUser);
};
