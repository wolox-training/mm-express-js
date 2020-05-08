const { truncateDatabase } = require('./utils');

truncateDatabase().catch(() => process.exit(1));
