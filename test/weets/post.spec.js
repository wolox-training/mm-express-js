const request = require('supertest');
const chance = require('chance').Chance(); // eslint-disable-line new-cap

const app = require('../../app');
const { AUTHORIZATION_ERROR, EXTERNAL_SERVICE_ERROR, WEET_LENGTH_EXCEEDED } = require('../../app/errors');
const { authorizedUserWithToken, tokenFromUser } = require('../helpers/authorized_user');
const { truncateDatabase, truncateTable } = require('../utils');
const { Weet } = require('../../app/models');
const {
  mockGeekJokesFailureResponse,
  mockGeekJokesSuccessResponse
} = require('../mocks/geek_jokes_responses');

describe('POST /weets', () => {
  const httpRequest = token => {
    const requestBuilder = request(app).post('/weets');
    return token ? requestBuilder.set('Authorization', `Bearer ${token}`) : requestBuilder;
  };
  let weetCreationResponse = {};

  describe('Without an authenticated user', () => {
    beforeAll(async () => {
      weetCreationResponse = await httpRequest();
    });

    test('Responds with 401 status code', () => expect(weetCreationResponse.statusCode).toBe(401));

    test('Responds with the expected error code', () =>
      expect(weetCreationResponse.body.internal_code).toBe(AUTHORIZATION_ERROR));
  });

  describe('With a token from a non existent user', () => {
    beforeAll(async () => {
      const token = tokenFromUser({ email: 'unexisting@wolox.co' });
      weetCreationResponse = await httpRequest(token);
    });

    test('Responds with 401 status code', () => expect(weetCreationResponse.statusCode).toBe(401));

    test('Responds with the expected error code', () =>
      expect(weetCreationResponse.body.internal_code).toBe(AUTHORIZATION_ERROR));
  });

  describe('With an authorized user', () => {
    let user = {};
    let token = {};
    let mock = {};

    beforeAll(async () => {
      ({ user, token } = await authorizedUserWithToken());
    });
    afterAll(() => truncateDatabase());

    describe('When response from jokes api is succesful', () => {
      beforeAll(async () => {
        mock = mockGeekJokesSuccessResponse();
        weetCreationResponse = await httpRequest(token);
      });
      afterAll(() => truncateTable(Weet));
      test('Responds with 201 status code', () => expect(weetCreationResponse.statusCode).toBe(201));

      test('Responds with the expected schema', () =>
        expect(weetCreationResponse.body).toMatchObject({
          content: expect.any(String),
          user_id: expect.any(Number)
        }));

      test('Creates a weet belonging to this user', () => expect(user.getWeets()).resolves.toHaveLength(1));

      test('Calls mock', () => expect(mock.isDone()).toBe(true));
    });

    describe('With a failure response from jokes api', () => {
      beforeAll(async () => {
        mock = mockGeekJokesFailureResponse();
        weetCreationResponse = await httpRequest(token);
      });
      afterAll(() => truncateTable(Weet));

      test('Responds with 502 status code', () => expect(weetCreationResponse.statusCode).toBe(502));

      test('Responds with the expected error code', () =>
        expect(weetCreationResponse.body.internal_code).toBe(EXTERNAL_SERVICE_ERROR));

      test('Does not create a weet belonging to this user', () =>
        expect(user.getWeets()).resolves.toHaveLength(0));

      test('Calls mock', () => expect(mock.isDone()).toBe(true));
    });

    describe('When jokes api responds with a jokes with more than 140 characters', () => {
      const largeJoke = chance.word({ length: 141 });

      beforeAll(async () => {
        mock = mockGeekJokesSuccessResponse(largeJoke);
        weetCreationResponse = await httpRequest(token);
      });
      afterAll(() => truncateTable(Weet));

      test('Responds with 502 status code', () => expect(weetCreationResponse.statusCode).toBe(502));

      test('Responds with the expected error code', () =>
        expect(weetCreationResponse.body.internal_code).toBe(WEET_LENGTH_EXCEEDED));

      test('Does not create a weet belonging to this user', () =>
        expect(user.getWeets()).resolves.toHaveLength(0));

      test('Calls mock', () => expect(mock.isDone()).toBe(true));
    });
  });
});
