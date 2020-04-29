exports.config = {
  environment: 'testing',
  isTesting: true,
  common: {
    database: {
      name: process.env.DB_NAME_TEST
    },
    geekJokesApi: {
      baseUrl: process.env.GEEK_JOKES_API_URL || 'https://geek-jokes.sameerkumar.website/api?format=json'
    },
    session: {
      secret: 'some-super-secret'
    }
  }
};
