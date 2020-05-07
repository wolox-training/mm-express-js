const request = require('supertest');

const app = require('../../app');
const { hashPassword } = require('../../app/helpers/passwords');
const { createUser } = require('../factory/users_factory');
const { FIELD_VALIDATION_ERROR, INVALID_LOGIN_ERROR } = require('../../app/errors');
const { decode } = require('../../app/helpers/jwt_utils');

describe('POST /users/sessions', () => {
  const httpRequest = params =>
    request(app)
      .post('/users/sessions')
      .send(params);

  describe('with an user created', () => {
    const email = 'user_email@wolox.co';
    const password = 'secret_password_123';
    beforeEach(async () => createUser({ email, password: await hashPassword(password) }));

    describe('when sending the correct params', () => {
      const params = { email, password };

      test('Responds with 201 created', () =>
        httpRequest(params).then(response => expect(response.status).toBe(201)));

      test('Responds with a token', () =>
        httpRequest(params).then(response =>
          expect(response.body).toMatchObject({ token: expect.any(String) })
        ));

      test('Responds with a correct JWT containing user data', () =>
        httpRequest(params).then(response => expect(decode(response.body.token)).toMatchObject({ email })));
    });

    describe('when sending an invalid password', () => {
      const params = { email, password: 'invalid' };

      test('Responds with 422 unprocessable entity', () =>
        httpRequest(params).then(response => expect(response.status).toBe(422)));

      test('Responds with the expected error code', () =>
        httpRequest(params).then(response => expect(response.body.internal_code).toBe(INVALID_LOGIN_ERROR)));
    });

    describe('with invalid params', () => {
      const params = { email: 'afdsaafsd' };

      test('Responds with 422 unprocessable entity', () =>
        httpRequest(params).then(response => expect(response.status).toBe(422)));

      test('Responds with the expected error code', () =>
        httpRequest(params).then(response =>
          expect(response.body.internal_code).toBe(FIELD_VALIDATION_ERROR)
        ));
    });
  });

  describe('without an user created', () => {
    const params = { email: 'tincho@wolox.co', password: 'wolotz1189' };

    test('Responds with 422 unprocessable entity', () =>
      httpRequest(params).then(response => expect(response.status).toBe(422)));

    test('Responds with the expected error code', () =>
      httpRequest(params).then(response => expect(response.body.internal_code).toBe(INVALID_LOGIN_ERROR)));
  });
});
