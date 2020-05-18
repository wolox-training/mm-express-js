const request = require('supertest');

const app = require('../../app');
const { createManyUsers } = require('../factory/users_factory');
const { showUserSerializer } = require('../../app/serializers/users');
const { tokenFromUser } = require('../helpers/authorized_user');
const { AUTHORIZATION_ERROR, FIELD_VALIDATION_ERROR } = require('../../app/errors');

describe('GET /users', () => {
  describe('With an user loged in', () => {
    let usersIndexResponse = {};
    let users = {};
    let token = {};

    beforeAll(async () => {
      users = await createManyUsers(2);
      token = await tokenFromUser(users[0]);
    });

    const httpRequest = (query = {}) =>
      request(app)
        .get('/users')
        .set('Authorization', `Bearer ${token}`)
        .query(query);

    describe('without query params', () => {
      beforeAll(async () => {
        usersIndexResponse = await httpRequest();
      });

      test('Responds with 200 status code', () => expect(usersIndexResponse.statusCode).toBe(200));

      test('Responds with the expected body structure', () =>
        expect(usersIndexResponse.body).toMatchObject({
          page: expect.any(Array),
          total_count: expect.any(Number)
        }));

      test('Responds with the expected users', () => {
        expect(usersIndexResponse.body.page).toEqual(users.map(showUserSerializer));
      });
    });

    describe('with query params', () => {
      beforeAll(async () => {
        usersIndexResponse = await httpRequest({ page: 2, limit: 1 });
      });

      test('Responds with 200 status code', () => expect(usersIndexResponse.statusCode).toBe(200));

      test('Responds with the expected body structure', () =>
        expect(usersIndexResponse.body).toMatchObject({
          page: expect.any(Array),
          total_count: expect.any(Number)
        }));

      test('Responds with the expected users', () => {
        expect(usersIndexResponse.body.page).toEqual([showUserSerializer(users[1])]);
      });
    });

    describe('with invalid query params', () => {
      beforeAll(async () => {
        usersIndexResponse = await httpRequest({ page: 'fldsmdfr', limit: '[object Object]' });
      });

      test('Responds with 422 status code', () => expect(usersIndexResponse.statusCode).toBe(422));

      test('Responds with the expected error code', () =>
        expect(usersIndexResponse.body.internal_code).toBe(FIELD_VALIDATION_ERROR));
    });
  });

  describe('Without an user logged in', () => {
    let usersIndexResponse = {};

    const httpRequest = () => request(app).get('/users');

    beforeAll(async () => {
      usersIndexResponse = await httpRequest();
    });

    test('Responds with 401 status code', () => expect(usersIndexResponse.statusCode).toBe(401));

    test('Responds with the expected error code', () =>
      expect(usersIndexResponse.body.internal_code).toBe(AUTHORIZATION_ERROR));
  });
});
