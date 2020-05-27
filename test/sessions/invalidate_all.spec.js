const request = require('supertest');

const app = require('../../app');
const { AUTHORIZATION_ERROR } = require('../../app/errors');
const { truncateDatabase } = require('../utils');
const { tokenFromUser, authorizedUserWithToken } = require('../helpers/authorized_user');

describe('POST /users/sessions/invalidate_all', () => {
  const httpRequest = token => {
    const requestBuilder = request(app).post('/users/sessions/invalidate_all');
    return token ? requestBuilder.set('Authorization', `Bearer ${token}`) : requestBuilder;
  };
  let invalidationResponse = {};

  describe('Without an user logged in', () => {
    beforeAll(async () => {
      invalidationResponse = await httpRequest();
    });

    test('Responds with 401 status code', () => expect(invalidationResponse.status).toBe(401));

    test('Responds with the expected error code', () =>
      expect(invalidationResponse.body.internal_code).toBe(AUTHORIZATION_ERROR));
  });

  describe('With an token from an invalid user', () => {
    beforeAll(async () => {
      const token = tokenFromUser({ email: 'invalid@wolox.com' });
      invalidationResponse = await httpRequest(token);
    });
    test('Responds with 401 status code', () => expect(invalidationResponse.status).toBe(401));

    test('Responds with the expected error code', () =>
      expect(invalidationResponse.body.internal_code).toBe(AUTHORIZATION_ERROR));
  });

  describe('With a valid token', () => {
    let user = {};
    let token = {};
    let now = {};
    const originalNowFunction = Date.now;

    beforeAll(async () => {
      ({ user, token } = await authorizedUserWithToken());
      now = Date.now();
      Date.now = jest.fn().mockReturnValue(now);
      invalidationResponse = await httpRequest(token);
    });

    afterAll(async () => {
      await truncateDatabase();
      Date.now = originalNowFunction;
    });

    test('Responds with 200 status code', () => expect(invalidationResponse.status).toBe(200));

    test('Updates user sessionsExpiredAt attribute', () =>
      expect(user.reload().then(reloadedUser => reloadedUser.sessionsExpiredAt)).resolves.toEqual(
        new Date(now)
      ));
  });

  describe('With an expired token', () => {
    beforeAll(async () => {
      const { token } = await authorizedUserWithToken();
      await httpRequest(token);
      invalidationResponse = await httpRequest(token);
    });

    afterAll(() => truncateDatabase());

    test('Responds with 401 status code', () => expect(invalidationResponse.status).toBe(401));

    test('Responds with the expected error code', () =>
      expect(invalidationResponse.body.internal_code).toBe(AUTHORIZATION_ERROR));
  });
});
