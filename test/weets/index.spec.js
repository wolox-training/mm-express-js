const request = require('supertest');
const { sortBy } = require('lodash');

const app = require('../../app');
const { createUser } = require('../factory/users_factory');
const { createManyWeets } = require('../factory/weets_factory');
const { showWeetSerializer } = require('../../app/serializers/weets');
const { tokenFromUser } = require('../helpers/authorized_user');
const { AUTHORIZATION_ERROR, FIELD_VALIDATION_ERROR } = require('../../app/errors');

describe('GET /users', () => {
  const httpRequest = ({ query = {}, token } = {}) => {
    const requestBuilder = request(app)
      .get('/weets')
      .query(query);
    return token ? requestBuilder.set('Authorization', `Bearer ${token}`) : requestBuilder;
  };
  let weetsIndexResponse = {};

  describe('With an user loged in', () => {
    let weets = {};
    let token = {};

    beforeAll(async () => {
      const user = await createUser();
      weets = sortBy(await createManyWeets(2, { userId: user.id }), 'id');
      token = tokenFromUser(user);
    });

    describe('without query params', () => {
      beforeAll(async () => {
        weetsIndexResponse = await httpRequest({ token });
      });

      test('Responds with 200 status code', () => expect(weetsIndexResponse.statusCode).toBe(200));

      test('Responds with the expected body structure', () =>
        expect(weetsIndexResponse.body).toMatchObject({
          page: expect.any(Array),
          total_count: expect.any(Number)
        }));

      test('Responds with the expected weets', () => {
        expect(weetsIndexResponse.body.page).toEqual(weets.map(showWeetSerializer));
      });
    });

    describe('with query params', () => {
      const query = { page: 2, limit: 1 };
      beforeAll(async () => {
        weetsIndexResponse = await httpRequest({ query, token });
      });

      test('Responds with 200 status code', () => expect(weetsIndexResponse.statusCode).toBe(200));

      test('Responds with the expected body structure', () =>
        expect(weetsIndexResponse.body).toMatchObject({
          page: expect.any(Array),
          total_count: expect.any(Number)
        }));

      test('Responds with the expected users', () => {
        expect(weetsIndexResponse.body.page).toEqual([showWeetSerializer(weets[1])]);
      });
    });

    describe('with invalid query params', () => {
      const query = { page: 4.31, limit: 'dos' };
      beforeAll(async () => {
        weetsIndexResponse = await httpRequest({ query, token });
      });

      test('Responds with 422 status code', () => expect(weetsIndexResponse.statusCode).toBe(422));

      test('Responds with the expected error code', () =>
        expect(weetsIndexResponse.body.internal_code).toBe(FIELD_VALIDATION_ERROR));
    });
  });

  describe('With an invalid token', () => {
    beforeAll(async () => {
      const token = tokenFromUser({ email: 'invalid@wolox.com.ar', role: 'user' });
      weetsIndexResponse = await httpRequest({ token });
    });

    test('Responds with 422 status code', () => expect(weetsIndexResponse.statusCode).toBe(401));

    test('Responds with the expected error code', () =>
      expect(weetsIndexResponse.body.internal_code).toBe(AUTHORIZATION_ERROR));
  });

  describe('Without an user logged in', () => {
    beforeAll(async () => {
      weetsIndexResponse = await httpRequest();
    });

    test('Responds with 401 status code', () => expect(weetsIndexResponse.statusCode).toBe(401));

    test('Responds with the expected error code', () =>
      expect(weetsIndexResponse.body.internal_code).toBe(AUTHORIZATION_ERROR));
  });
});
