const { passwordSchema, emailSchema } = require('./users');

exports.sessionsCreationSchema = {
  password: passwordSchema,
  email: emailSchema
};
