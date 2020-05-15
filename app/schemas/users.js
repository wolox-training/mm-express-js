exports.passwordSchema = {
  errorMessage: 'password must have at least 7 characters',
  isLength: { options: { min: 7 } }
};

const woloxMailRegexp = /.*@wolox(\.com\.ar|\.co|\.cl)$/;

exports.emailSchema = {
  errorMessage: 'email must have email format with wolox domail',
  custom: {
    options: email => woloxMailRegexp.test(email)
  },
  isEmail: true
};

exports.userCreationSchema = {
  first_name: {
    errorMessage: 'first_name must be present',
    isEmpty: { negated: true }
  },
  last_name: {
    errorMessage: 'last_name must be present',
    isEmpty: { negated: true }
  },
  password: exports.passwordSchema,
  email: exports.emailSchema
};
