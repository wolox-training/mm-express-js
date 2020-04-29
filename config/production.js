exports.config = {
  environment: 'production',
  common: {
    database: {
      name: process.env.DB_NAME
    },
    geekJokesApi: {
      baseUrl: process.env.GEEK_JOKES_API_URL
    }
  },
  isProduction: true
};
