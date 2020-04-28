const axios = require('axios');

const errors = require('../errors');

exports.getRandom = () => {
  const endpoint = 'https://geek-jokes.sameerkumar.website/api?format=json';
  return axios
    .get(endpoint)
    .then(response => response.data.joke)
    .catch(response => errors.serviceError(`Geek Jokes reponds with ${response.status}`));
};
