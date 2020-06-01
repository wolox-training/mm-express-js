const user = require('./user');
const session = require('./session');
const admin = require('./admin');
const rating = require('./rating');
const weet = require('./weet');

module.exports = { ...user, ...session, ...admin, ...rating, ...weet };
