const request = require('supertest');

const app = require('../../app');
const { createManyUsers } = require('../factory/users_factory');
const { showUserSerializer } = require('../../app/serializers/users');

describe('GET /users', () => {
  const httpRequest = (query = {}) =>
    request(app)
      .get('/users')
      .query(query);
  let usersIndexResponse = {};
  let users = {};
  beforeAll(async () => {
    users = await createManyUsers(2);
  });

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
});
