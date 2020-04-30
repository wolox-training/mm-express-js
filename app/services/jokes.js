const axios = require('axios');

const { externalServiceError } = require('../errors');
const config = require('../../config');

const { baseUrl } = config.common.geekJokesApi;

exports.getRandomJoke = () =>
  axios
    .get(baseUrl)
    .then(response => {
      if (response.data) return response.data.joke;
      throw externalServiceError('Geek Jokes responds with an invalid body');
    })
    .catch(error => {
      throw externalServiceError(
        error.response
          ? `Geek Jokes API reponds with ${error.response.status}`
          : 'Can not get a response from Geek Jokes API'
      );
    });
