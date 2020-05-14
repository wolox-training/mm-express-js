const user = require('./user');
const session = require('./session');
const admin = require('./admin');

module.exports = { ...user, ...session, ...admin };
