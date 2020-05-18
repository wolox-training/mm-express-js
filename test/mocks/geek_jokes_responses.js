const nock = require('nock');

const {
  common: {
    geekJokesApi: { baseUrl }
  }
} = require('../../config');

const exampleJoke = 'When Chuck Norris makes a burrito, its main ingredient is real toes.';
const { origin, pathname } = new URL(baseUrl);

exports.mockGeekJokesSuccessResponse = (joke = exampleJoke) =>
  nock(origin)
    .get(pathname)
    .query({ format: 'json' })
    .reply(200, { joke });

exports.mockGeekJokesFailureResponse = () =>
  nock(origin)
    .get(pathname)
    .query({ format: 'json' })
    .reply(500);
