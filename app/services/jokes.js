const axios = require('axios');
const { info } = require('../logger');

const { externalServiceError } = require('../errors');
const {
  common: {
    geekJokesApi: { baseUrl }
  }
} = require('../../config');

exports.getRandomJoke = () => {
  info('Calling jokesService.getRandomJoke');
  return axios
    .get(baseUrl, { params: { format: 'json' } })
    .then(response => {
      if (response.data && response.data.joke) return response.data.joke;
      throw externalServiceError('Geek Jokes responds with an invalid body');
    })
    .catch(error => {
      throw externalServiceError(
        error.response
          ? `Geek Jokes API reponds with ${error.response.status}`
          : 'Can not get a response from Geek Jokes API'
      );
    });
};
