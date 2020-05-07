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
