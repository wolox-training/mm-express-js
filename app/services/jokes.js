const axios = require('axios');

const errors = require('../errors');

exports.getRandom = () => {
  const endpoint = 'https://geek-jokes.sameerkumar.website/api?format=json';
  return axios
    .get(endpoint)
    .then(response => response.data.joke)
    .catch(error =>
      Promise.reject(
        errors.serviceError(
          error.response
            ? `Geek Jokes API reponds with ${error.response.status}`
            : 'Can not get a response from Geek Jokes API'
        )
      )
    );
};
