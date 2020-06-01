const { sendPostRequest } = require('../helpers/requests');
const { AUTHORIZATION_ERROR } = require('../../app/errors');
const { truncateDatabase } = require('../utils');
const { tokenFromUser, authorizedUserWithToken } = require('../helpers/authorized_user');

describe('POST /users/sessions/invalidate_all', () => {
  const httpRequest = token => sendPostRequest({ path: '/users/sessions/invalidate_all', token });
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
    let dateSpy = {};

    beforeAll(async () => {
      ({ user, token } = await authorizedUserWithToken());
      now = Date.now();
      dateSpy = jest.spyOn(Date, 'now').mockReturnValue(now);
      invalidationResponse = await httpRequest(token);
    });

    afterAll(async () => {
      dateSpy.mockRestore();
      await truncateDatabase();
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
