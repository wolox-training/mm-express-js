const request = require('supertest');

const app = require('../../app');
const { camelizeKeys } = require('../../app/helpers/object_utils');
const { buildUserJson, createUser } = require('../factory/users_factory');
const { FIELD_VALIDATION_ERROR, AUTHORIZATION_ERROR, PERMISSIONS_ERROR } = require('../../app/errors');
const { authorizedUserWithToken } = require('../helpers/authorized_user');
const { User } = require('../../app/models');
const { truncateDatabase } = require('../utils');

describe('POST /users', () => {
  let userCreationResponse = {};

  const httpRequest = (params, token) => {
    const requestBuilder = request(app)
      .post('/admin/users')
      .send(params);
    return token ? requestBuilder.set('Authorization', `Bearer ${token}`) : requestBuilder;
  };

  describe('With an admin user logged in', () => {
    describe('when params are OK', () => {
      describe('when an user does not exists', () => {
        let createdUser = {};
        beforeAll(async () => {
          const { token } = await authorizedUserWithToken({ role: 'admin' });
          userCreationResponse = await httpRequest(await buildUserJson(), token);
          createdUser = await User.findByPk(userCreationResponse.body.id);
        });
        afterAll(() => truncateDatabase());

        test('Responds with 201 status code', () => expect(userCreationResponse.statusCode).toBe(201));

        test('Creates the returned user', () =>
          expect(createdUser).toMatchObject(camelizeKeys(userCreationResponse.body)));

        test('Creates an user with admin role', () => expect(createdUser.role).toBe('admin'));
      });

      describe('when exists an user with this email', () => {
        const email = 'some_user@wolox.cl';
        let user = {};

        beforeAll(async () => {
          const [createdUser, { token }] = await Promise.all([
            createUser({ email }),
            authorizedUserWithToken({ role: 'admin' })
          ]);
          userCreationResponse = await httpRequest(await buildUserJson({ email }), token);
          user = await createdUser.reload();
        });
        afterAll(() => truncateDatabase());

        test('Responds with 201 status code', () => expect(userCreationResponse.statusCode).toBe(201));

        test('Updates the non admin user', () => expect(user).toMatchObject(camelizeKeys(user.body)));

        test('Updates role´s user to admin', () => expect(user.role).toBe('admin'));
      });
    });

    describe('when params are wrong', () => {
      beforeAll(async () => {
        const { token } = await authorizedUserWithToken({ role: 'admin' });
        userCreationResponse = await httpRequest({ email: 'dsfafsd' }, token);
      });
      afterAll(() => truncateDatabase());

      test('Responds with 422 status code', () => expect(userCreationResponse.statusCode).toBe(422));

      test('Responds with the expected error code', () =>
        expect(userCreationResponse.body.internal_code).toBe(FIELD_VALIDATION_ERROR));

      test('Does not create a new user', () => expect(User.count()).resolves.toBe(1));
    });
  });

  describe('Without an authenticated user', () => {
    beforeAll(async () => {
      userCreationResponse = await httpRequest(await buildUserJson());
    });

    test('Responds with 401 status code', () => expect(userCreationResponse.statusCode).toBe(401));

    test('Responds with the expected error code', () =>
      expect(userCreationResponse.body.internal_code).toBe(AUTHORIZATION_ERROR));
  });

  describe('With an non admin authenticated user', () => {
    beforeAll(async () => {
      const { token } = await authorizedUserWithToken({ role: 'user' });
      userCreationResponse = await httpRequest(await buildUserJson(), token);
    });
    afterAll(() => truncateDatabase());

    test('Responds with 403 status code', () => expect(userCreationResponse.statusCode).toBe(403));

    test('Responds with the expected error code', () =>
      expect(userCreationResponse.body.internal_code).toBe(PERMISSIONS_ERROR));
  });
});
