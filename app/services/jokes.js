const axios = require('axios');
const { info } = require('../logger');

const { externalServiceError, EXTERNAL_SERVICE_ERROR } = require('../errors');
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
      if (error.internalCode && error.internalCode === EXTERNAL_SERVICE_ERROR) throw error;
      throw externalServiceError(
        error.response
          ? `Geek Jokes API reponds with ${error.response.status}`
          : 'Can not get a response from Geek Jokes API'
      );
    });
};
