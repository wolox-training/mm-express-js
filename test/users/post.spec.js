const request = require('supertest');

const app = require('../../app');
const { createUser, buildUserJson } = require('../factory/users_factory');
const { FIELD_VALIDATION_ERROR, USER_EMAIL_REPEATED_ERROR } = require('../../app/errors');
const { User } = require('../../app/models');
const { truncateDatabase } = require('../utils');
const { showUserSerializer } = require('../../app/serializers/users');

describe('POST /users', () => {
  const httpRequest = params =>
    request(app)
      .post('/users')
      .send(params);
  let userCreationResponse = {};

  describe('when params are OK', () => {
    const userParams = buildUserJson();
    beforeAll(async () => {
      userCreationResponse = await httpRequest(await userParams);
    });
    afterAll(() => truncateDatabase());
    const dataToCheck = user => ({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email
    });

    test('Responds with 201 status code', () => expect(userCreationResponse.statusCode).toBe(201));

    test('Responds with the expected body schema', () =>
      expect(userCreationResponse.body).toMatchObject({
        id: expect.any(Number),
        first_name: expect.any(String),
        last_name: expect.any(String),
        email: expect.any(String),
        job_position: expect.any(String)
      }));

    test('Responds with the expected body values', async () =>
      expect(userCreationResponse.body).toMatchObject(dataToCheck(await userParams)));

    test('Creates the returned user', async () => {
      const createdUser = await User.findByPk(userCreationResponse.body.id);
      expect(showUserSerializer(createdUser)).toMatchObject(userCreationResponse.body);
    });
  });

  describe('when password doesn´t satisfy minimun length', () => {
    beforeAll(async () => {
      userCreationResponse = await httpRequest(await buildUserJson({ password: 'short' }));
    });
    afterAll(() => truncateDatabase());

    test('Responds with 422 status code', () => expect(userCreationResponse.statusCode).toBe(422));

    test('Responds with the expected error code', () =>
      expect(userCreationResponse.body.internal_code).toBe(FIELD_VALIDATION_ERROR));

    test('Does not create a new user', () => expect(User.count()).resolves.toBe(0));
  });

  describe('without mandatory parameters', () => {
    beforeAll(async () => {
      userCreationResponse = await httpRequest({});
    });
    afterAll(() => truncateDatabase());

    test('Responds with 422 status code', () => expect(userCreationResponse.statusCode).toBe(422));

    test('Responds with the expected error code', () =>
      expect(userCreationResponse.body.internal_code).toBe(FIELD_VALIDATION_ERROR));

    test('Does not create a new user', () => expect(User.count()).resolves.toBe(0));
  });

  describe('when email is already used', () => {
    const email = 'some_email@wolox.co';
    const userParams = buildUserJson({ email });
    beforeAll(async () => {
      await createUser({ email });
      userCreationResponse = await httpRequest(await userParams);
    });
    afterAll(() => truncateDatabase());

    test('Responds with 422 status code', () => expect(userCreationResponse.statusCode).toBe(422));

    test('Responds with the expected error code', () =>
      expect(userCreationResponse.body.internal_code).toBe(USER_EMAIL_REPEATED_ERROR));

    test('Does not create a new user', () => expect(User.count()).resolves.toBe(1));
  });
});
