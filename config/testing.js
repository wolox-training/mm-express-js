exports.config = {
  environment: 'testing',
  isTesting: true,
  common: {
    database: {
      name: process.env.DB_NAME_TEST
    },
    session: {
      secret: 'some-super-secret'
    },
    geekJokesApi: {
      baseUrl: process.env.GEEK_JOKES_API_URL || 'https://testing.geekJokes.com/api'
    }
  }
};
