exports.config = {
  environment: 'development',
  common: {
    database: {
      name: process.env.DB_NAME_DEV
    },
    geekJokesApi: {
      baseUrl: process.env.GEEK_JOKES_API_URL || 'https://geek-jokes.sameerkumar.website/api?format=json'
    }
  },
  isDevelopment: true
};
