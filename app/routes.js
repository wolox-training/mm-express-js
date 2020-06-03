const { healthCheck } = require('./controllers/healthCheck');
const { createUserSession, invalidateAllUserSessions } = require('./controllers/sessions');
const { createUser, usersIndex, createAdminUser } = require('./controllers/users');
const { createWeet, weetsIndex } = require('./controllers/weets');
const { createRating } = require('./controllers/ratings');
const { validateUserEmailUniqueness, setUserByEmail, setCurrentUser } = require('./middlewares/users');
const { verifyUserPresence, verifyJwt, verifyAdmin } = require('./middlewares/sessions');
const { schemaValidation } = require('./middlewares/fields_validation');
const { userCreationSchema } = require('./schemas/users');
const { sessionsCreationSchema } = require('./schemas/sessions');
const { ratingSchema } = require('./schemas/ratings');
const { paginationParamsSchema } = require('./schemas/pagination_params');

exports.init = app => {
  app.get('/health', healthCheck);
  app.get('/users', [schemaValidation(paginationParamsSchema), verifyJwt, setCurrentUser], usersIndex);

  // Called from Auth0 webhook
  app.post('/users', [schemaValidation(userCreationSchema), validateUserEmailUniqueness], createUser);

  app.post(
    '/users/sessions',
    [schemaValidation(sessionsCreationSchema), verifyUserPresence],
    createUserSession
  );
  app.post('/users/sessions/invalidate_all', [verifyJwt, setCurrentUser], invalidateAllUserSessions);
  app.post('/weets', [verifyJwt, setCurrentUser], createWeet);
  app.get('/weets', [schemaValidation(paginationParamsSchema), verifyJwt, setCurrentUser], weetsIndex);
  app.post('/weets/:id/ratings', [schemaValidation(ratingSchema), verifyJwt, setCurrentUser], createRating);

  app.use('/admin', verifyJwt, verifyAdmin, setCurrentUser);
  app.post('/admin/users', [schemaValidation(userCreationSchema), setUserByEmail], createAdminUser);
};
