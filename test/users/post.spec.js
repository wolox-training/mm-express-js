const request = require('supertest');
const _ = require('lodash');

const app = require('../../app');
const { createUser, buildUserJson } = require('../factory/users_factory');
const { FIELD_VALIDATION_ERROR, userEmailRepeatedError } = require('../../app/errors');
const { underscoreKeys } = require('../../app/helpers/object_utils');

describe('POST /users', () => {
  const httpRequest = params =>
    request(app)
      .post('/users')
      .send(params);

  describe('when params are OK', () => {
    const userParams = buildUserJson();

    test('Responds with 201 status code', () =>
      userParams.then(httpRequest).then(response => expect(response.statusCode).toBe(201)));

    test('Responds with the expected body', () =>
      userParams.then(httpRequest).then(response =>
        expect(response.body).toMatchObject({
          ..._.pick(userParams, 'first_name', 'last_name', 'email'),
          id: expect.any(Number)
        })
      ));
  });

  describe('without mandatory parameters', () => {
    const userParams = {};

    test('Responds with 422 status code', () =>
      httpRequest(userParams).then(response => expect(response.statusCode).toBe(422)));

    test('Responds with the expected error code', () =>
      httpRequest(userParams).then(response =>
        expect(response.body.internal_code).toBe(FIELD_VALIDATION_ERROR)
      ));
  });

  describe('when email is already used', () => {
    const email = 'some_email@mail.com';
    const userParams = buildUserJson({ email });
    beforeEach(() => createUser({ email }));

    test('Responds with 422 status code', () =>
      userParams.then(httpRequest).then(response => expect(response.statusCode).toBe(422)));

    test('Responds with the expected error', () =>
      userParams
        .then(httpRequest)
        .then(response =>
          expect(response.body).toMatchObject(underscoreKeys(userEmailRepeatedError('E-mail already in use')))
        ));
  });
});
