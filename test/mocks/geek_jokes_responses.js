const nock = require('nock');

const {
  common: {
    geekJokesApi: { baseUrl }
  }
} = require('../../config');

const exampleJoke = 'When Chuck Norris makes a burrito, its main ingredient is real toes.';
const { origin, pathname } = new URL(baseUrl);

const mockGeekJokeWithResponse = (statusCode, body) =>
  nock(origin)
    .get(pathname)
    .query({ format: 'json' })
    .reply(statusCode, body);

exports.mockGeekJokesSuccessResponse = (joke = exampleJoke) => mockGeekJokeWithResponse(200, { joke });

exports.mockGeekJokesFailureResponse = () => mockGeekJokeWithResponse(500);
