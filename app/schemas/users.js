exports.userCreationSchema = {
  first_name: {
    errorMessage: 'first_name must be present',
    isEmpty: { negated: true }
  },
  last_name: {
    errorMessage: 'last_name must be present',
    isEmpty: { negated: true }
  },
  password: {
    errorMessage: 'password must have at least 7 characters',
    isLength: { options: { min: 7 } }
  },
  email: {
    errorMessage: 'email must have email format',
    isEmail: true
  }
};
