const axios = require('axios');

const errors = require('../errors');

exports.getRandom = () => {
  const endpoint = 'https://geek-jokes.sameerkumar.website/api?format=json';
  return axios
    .get(endpoint)
    .then(response => response.data.joke)
    .catch(error => {
      if (!error.response) return errors.serviceError('Can not get a response from Geek Jokes API');
      return errors.serviceError(`Geek Jokes API reponds with ${error.response.status}`);
    });
};
