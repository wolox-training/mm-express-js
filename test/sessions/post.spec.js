const request = require('supertest');

const app = require('../../app');
const { hashPassword } = require('../../app/helpers/passwords');
const { createUser } = require('../factory/users_factory');
const { FIELD_VALIDATION_ERROR, INVALID_LOGIN_ERROR } = require('../../app/errors');
const { decode } = require('../../app/helpers/jwt_utils');
const { truncateDatabase } = require('../utils');

describe('POST /users/sessions', () => {
  const httpRequest = params =>
    request(app)
      .post('/users/sessions')
      .send(params);
  let sessionCreationResponse = {};

  describe('with an user created', () => {
    const email = 'user_email@wolox.co';
    const password = 'secret_password_123';
    let user = {};
    beforeAll(async () => {
      user = await createUser({ email, password: await hashPassword(password) });
    });
    afterAll(() => truncateDatabase());

    describe('when sending the correct params', () => {
      const params = { email, password };
      beforeAll(async () => {
        sessionCreationResponse = await httpRequest(params);
      });

      test('Responds with 200 status code', () => expect(sessionCreationResponse.status).toBe(200));

      test('Responds with a token', () =>
        expect(sessionCreationResponse.body).toMatchObject({ token: expect.any(String) }));

      test('Responds with a correct JWT containing user data', () =>
        expect(decode(sessionCreationResponse.body.token)).toMatchObject({
          sub: user.id,
          email: user.email
        }));
    });

    describe('when sending an invalid password', () => {
      const params = { email, password: 'invalid' };
      beforeAll(async () => {
        sessionCreationResponse = await httpRequest(params);
      });

      test('Responds with 401 status code', () => expect(sessionCreationResponse.status).toBe(401));

      test('Responds with the expected error code', () =>
        expect(sessionCreationResponse.body.internal_code).toBe(INVALID_LOGIN_ERROR));
    });

    describe('with invalid params', () => {
      const params = { email: 'afdsaafsd' };
      beforeAll(async () => {
        sessionCreationResponse = await httpRequest(params);
      });

      test('Responds with 422 status code', () => expect(sessionCreationResponse.status).toBe(422));

      test('Responds with the expected error code', () =>
        expect(sessionCreationResponse.body.internal_code).toBe(FIELD_VALIDATION_ERROR));
    });
  });

  describe('without an user created', () => {
    const params = { email: 'tincho@wolox.co', password: 'wolotz1189' };
    beforeAll(async () => {
      sessionCreationResponse = await httpRequest(params);
    });

    test('Responds with 401 status code', () => expect(sessionCreationResponse.status).toBe(401));

    test('Responds with the expected error code', () =>
      expect(sessionCreationResponse.body.internal_code).toBe(INVALID_LOGIN_ERROR));
  });
});
