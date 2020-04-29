const axios = require('axios');

const errors = require('../errors');
const config = require('../../config');

const { baseUrl } = config.common.geekJokesApi;

exports.getRandom = () =>
  axios
    .get(baseUrl)
    .then(response => {
      if (response.data) return response.data.joke;
      throw errors.serviceError('Geek Jokes responds with an invalid body');
    })
    .catch(error => {
      throw errors.serviceError(
        error.response
          ? `Geek Jokes API reponds with ${error.response.status}`
          : 'Can not get a response from Geek Jokes API'
      );
    });
