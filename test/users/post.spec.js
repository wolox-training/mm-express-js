const request = require('supertest');

const app = require('../../app');
const { createUser, buildUserJson } = require('../factory/users_factory');
const { FIELD_VALIDATION_ERROR, USER_EMAIL_REPEATED_ERROR } = require('../../app/errors');
const { camelizeKeys } = require('../../app/helpers/object_utils');
const { User } = require('../../app/models');
const { truncateDatabase } = require('../utils');

describe('POST /users', () => {
  const httpRequest = params =>
    request(app)
      .post('/users')
      .send(params);
  let userCreatedResponse = {};

  describe('when params are OK', () => {
    const userParams = buildUserJson();
    beforeAll(() => {
      userCreatedResponse = userParams.then(httpRequest);
    });
    afterAll(() => truncateDatabase());
    const dataToCheck = user => ({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email
    });

    test('Responds with 201 status code', () =>
      userCreatedResponse.then(response => expect(response.statusCode).toBe(201)));

    test('Responds with the expected body schema', () =>
      userCreatedResponse.then(response =>
        expect(response.body).toMatchObject({
          id: expect.any(Number),
          first_name: expect.any(String),
          last_name: expect.any(String),
          email: expect.any(String)
        })
      ));

    test('Responds with the expected body values', () =>
      userCreatedResponse.then(async response =>
        expect(response.body).toMatchObject(dataToCheck(await userParams))
      ));

    test('Creates the returned user', () =>
      userCreatedResponse.then(response =>
        expect(User.findByPk(response.body.id)).resolves.toMatchObject(camelizeKeys(response.body))
      ));
  });

  describe('without mandatory parameters', () => {
    beforeAll(() => {
      userCreatedResponse = httpRequest({});
    });
    afterAll(() => truncateDatabase());

    test('Responds with 422 status code', () =>
      userCreatedResponse.then(response => expect(response.statusCode).toBe(422)));

    test('Responds with the expected error code', () =>
      userCreatedResponse.then(response => expect(response.body.internal_code).toBe(FIELD_VALIDATION_ERROR)));

    test('Does not create a new user', () =>
      userCreatedResponse.then(() => expect(User.count()).resolves.toBe(0)));
  });

  describe('when email is already used', () => {
    const email = 'some_email@wolox.co';
    const userParams = buildUserJson({ email });
    beforeAll(() =>
      createUser({ email }).then(() => {
        userCreatedResponse = userParams.then(httpRequest);
      })
    );
    afterAll(() => truncateDatabase());

    test('Responds with 422 status code', () =>
      userCreatedResponse.then(response => expect(response.statusCode).toBe(422)));

    test('Responds with the expected error', () =>
      userCreatedResponse.then(response =>
        expect(response.body.internal_code).toBe(USER_EMAIL_REPEATED_ERROR)
      ));

    test('Does not create a new user', () =>
      userCreatedResponse.then(() => expect(User.count()).resolves.toBe(1)));
  });
});
