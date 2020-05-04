const request = require('supertest');
const { factory } = require('factory-girl');
const _ = require('lodash');

const app = require('../../app');
require('../factory/factory_by_models').factoryByModel('User');

describe('POST /users', () => {
  const endpoint = '/users';
  describe('when everything is OK', () => {
    const userParams = {
      first_name: 'Tincho',
      last_name: 'Mallea',
      password: 'mypass123',
      email: 'martin.mallea@fake.com'
    };

    test('Responds with 201 status code', () =>
      request(app)
        .post(endpoint)
        .send(userParams)
        .then(response => expect(response.statusCode).toBe(201)));

    test('Responds with the expected body', () =>
      request(app)
        .post(endpoint)
        .send(userParams)
        .then(response =>
          expect(response.body).toMatchObject({
            ..._.pick(userParams, 'first_name', 'last_name', 'email'),
            id: expect.any(Number)
          })
        ));
  });

  describe('without mandatory parameters', () => {
    test('Responds with 422 status code', () =>
      request(app)
        .post(endpoint)
        .send({})
        .then(response => expect(response.statusCode).toBe(422)));
  });

  describe('when email is already used', () => {
    const email = 'some_email@mail.com';
    const userParams = {
      first_name: 'Tincho',
      last_name: 'Mallea',
      password: 'mypass123',
      email
    };
    beforeAll(() => {
      factory.create('User', { email });
    });

    test('Responds with 422 status code', () =>
      request(app)
        .post(endpoint)
        .send(userParams)
        .then(response => expect(response.statusCode).toBe(422)));
  });
});
