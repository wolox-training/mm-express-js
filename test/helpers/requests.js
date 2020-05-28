const request = require('supertest');

const app = require('../../app');

const sendRequest = ({ token, body, path, method, query = {} } = {}) => {
  if (!path) throw new TypeError('path is required');
  const requestBuilder = request(app)[method](path).query(query).send(body); // eslint-disable-line
  return token ? requestBuilder.set('Authorization', `Bearer ${token}`) : requestBuilder;
};

exports.sendGetRequest = options => sendRequest({ ...options, method: 'get' });

exports.sendPostRequest = options => sendRequest({ ...options, method: 'post' });

exports.sendPutRequest = options => sendRequest({ ...options, method: 'put' });

exports.sendPatchRequest = options => sendRequest({ ...options, method: 'patch' });

exports.sendDeleteRequest = options => sendRequest({ ...options, method: 'delete' });
