const { healthCheck } = require('./controllers/healthCheck');
const { createUser } = require('./controllers/users');
const { validateUserEmailUniqueness } = require('./middlewares/users');
const { userCreationSchema } = require('./schemas/users');
const { schemaValidation } = require('./middlewares/fields_validation');

exports.init = app => {
  app.get('/health', healthCheck);
  app.post('/users', [schemaValidation(userCreationSchema), validateUserEmailUniqueness], createUser);
};
