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
    },
    mailer: {
      user: process.env.MAILER_USER || 'maileruser123',
      pass: process.env.MAILER_PASS || 'supersecret456',
      host: process.env.MAILER_HOST || 'smtp.example.email',
      port: process.env.MAILER_PORT || 587,
      from: process.env.MAILER_FROM_EMAIL || 'notifications@weeter.com'
    }
  }
};
