const request = require('supertest');

const app = require('../../app');
const { buildUserJson } = require('../factory/users_factory');
const { FIELD_VALIDATION_ERROR, AUTHORIZATION_ERROR } = require('../../app/errors');
const { authorizedUserWithToken } = require('../helpers/authorized_user');

describe('POST /users', () => {
  let userCreationResponse = {};

  const httpRequest = (params, token) =>
    request(app)
      .post('/admin/users')
      .set('Authorization', `Bearer ${token}`)
      .send(params);

  describe('With an admin user logged in', () => {
    let token = {};
    beforeAll(async () => {
      ({ token } = await authorizedUserWithToken({ role: 'admin' }));
    });

    describe('when params are OK', () => {
      beforeAll(async () => {
        userCreationResponse = await httpRequest(await buildUserJson(), token);
      });

      test('Responds with 201 status code', () => expect(userCreationResponse.statusCode).toBe(201));
    });

    describe('when params are wrong', () => {
      beforeAll(async () => {
        userCreationResponse = await httpRequest({ email: 'dsfafsd' }, token);
      });

      test('Responds with 422 status code', () => expect(userCreationResponse.statusCode).toBe(422));

      test('Responds with the expected error code', () =>
        expect(userCreationResponse.body.internal_code).toBe(FIELD_VALIDATION_ERROR));
    });
  });
  describe('Without an authenticated user', () => {
    beforeAll(async () => {
      userCreationResponse = await httpRequest(await buildUserJson(), '');
    });

    test('Responds with 401 status code', () => expect(userCreationResponse.statusCode).toBe(401));

    test('Responds with the expected error code', () =>
      expect(userCreationResponse.body.internal_code).toBe(AUTHORIZATION_ERROR));
  });
});
