const { checkSchema } = require('express-validator');

const { fieldsValidation } = require('./fields_validation');
const { passwordSchema, emailSchema } = require('./shared/schemas');

exports.sessionsBodyValidations = fieldsValidation(
  checkSchema({
    password: passwordSchema,
    email: emailSchema
  })
);
