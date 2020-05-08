const { truncateDatabase } = require('./utils');

global.beforeAll(() => truncateDatabase());
