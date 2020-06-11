const { sample } = require('lodash');

const { mockJwks } = require('../mocks/jwks');
const { sendPostRequest } = require('../helpers/requests');
const { Rating } = require('../../app/models');
const { createUser } = require('../factory/users_factory');
const { createWeet } = require('../factory/weets_factory');
const { AUTHORIZATION_ERROR, FIELD_VALIDATION_ERROR, WEET_NOT_FOUND_ERROR } = require('../../app/errors');
const { truncateDatabase } = require('../utils');
const { authorizedUserWithToken, tokenFromUser } = require('../helpers/authorized_user');

describe.skip('POST /weets/:id/ratings', () => {
  let createRatingResponse = {};
  const httpRequest = ({ token, weetId, body } = {}) =>
    sendPostRequest({ path: `/weets/${weetId}/ratings`, token, body });

  const responseSchema = {
    id: expect.any(Number),
    score: expect.any(Number),
    rating_user_id: expect.any(Number),
    weet_id: expect.any(Number)
  };

  let jwksMock = {};

  beforeAll(() => {
    jwksMock = mockJwks();
    jwksMock.start();
  });

  afterAll(() => jwksMock.stop());

  describe('With an user logged in', () => {
    const score = sample([-1, 1]);
    const differentScore = -score;
    const anotherScore = sample([-1, 1]);
    let ratingUser = {};
    let token = {};
    let anotherRatingUser = {};
    let anotherToken = {};
    let weet = {};
    let ratedUser = {};
    let weetNotFound = {};
    let invalidParameters = {};
    let firstRatingCreation = {};
    let ratingFromAnotherUserCreation = {};
    let sameScoreRatingCreation = {};
    let differentScoreRatingCreation = {};

    const getRatingFromResponse = response => Rating.findByPk(response.body.id);

    beforeAll(async () => {
      ({ user: ratingUser, token } = await authorizedUserWithToken({ jwksMock }));
      ({ user: anotherRatingUser, token: anotherToken } = await authorizedUserWithToken({ jwksMock }));
      ratedUser = await createUser();
      weet = await createWeet({ userId: ratedUser.id });

      weetNotFound = { response: await httpRequest({ token, weetId: 100, body: { score } }) };

      invalidParameters = { response: await httpRequest({ token, weetId: weet.id, body: { score: 1231 } }) };

      let response = {};

      response = await httpRequest({ token, weetId: weet.id, body: { score } });
      firstRatingCreation = {
        response,
        ratedUserPoints: (await ratedUser.reload()).points,
        rating: await getRatingFromResponse(response)
      };

      response = await httpRequest({ token, weetId: weet.id, body: { score } });
      sameScoreRatingCreation = {
        response,
        ratingsCount: await Rating.count(),
        rating: await getRatingFromResponse(response)
      };

      response = await httpRequest({
        token,
        weetId: weet.id,
        body: { score: differentScore }
      });
      differentScoreRatingCreation = {
        response,
        rating: await getRatingFromResponse(response),
        ratingsCount: await Rating.count(),
        ratedUserPoints: (await ratedUser.reload()).points
      };

      response = await httpRequest({
        token: anotherToken,
        weetId: weet.id,
        body: { score: anotherScore }
      });
      ratingFromAnotherUserCreation = {
        response,
        rating: await getRatingFromResponse(response),
        ratingsCount: await Rating.count(),
        ratedUserPoints: (await ratedUser.reload()).points
      };
    });
    afterAll(() => truncateDatabase());

    describe('When the requested weet doesn´t exist', () => {
      test('Responds with 404 status code', () => expect(weetNotFound.response.statusCode).toBe(404));

      test('Responds with the expected error code', () =>
        expect(weetNotFound.response.body.internal_code).toBe(WEET_NOT_FOUND_ERROR));
    });

    describe('When creating the first rating', () => {
      test('Responds with 201 status code', () => expect(firstRatingCreation.response.statusCode).toBe(201));

      test('Responds with the expected schema', () =>
        expect(firstRatingCreation.response.body).toMatchObject(responseSchema));

      test('Creates the expected rating', () => {
        expect(firstRatingCreation.rating).toMatchObject({
          score,
          ratingUserId: ratingUser.id,
          weetId: weet.id
        });
      });

      test('Modifies ratedUser points by the score', () =>
        expect(firstRatingCreation.ratedUserPoints).toBe(score));
    });

    describe('When there is a previous rating belonging to this user and weet', () => {
      describe('When new score is different than the old score', () => {
        test('Responds with 201 status code', () =>
          expect(differentScoreRatingCreation.response.statusCode).toBe(201));

        test('Responds with the expected schema', () =>
          expect(differentScoreRatingCreation.response.body).toMatchObject(responseSchema));

        test('Doesn´t create a new rating', () => expect(differentScoreRatingCreation.ratingsCount).toBe(1));

        test('Updates rating fields', () => {
          expect(differentScoreRatingCreation.rating).toMatchObject({
            score: differentScore,
            ratingUserId: ratingUser.id,
            weetId: weet.id
          });
        });

        test('Updates the ratedUser points', () =>
          expect(differentScoreRatingCreation.ratedUserPoints).toBe(differentScore));
      });

      describe('When new score is the same than the old score', () => {
        test('Responds with 201 status code', () =>
          expect(sameScoreRatingCreation.response.statusCode).toBe(201));

        test('Responds with the expected schema', () =>
          expect(sameScoreRatingCreation.response.body).toMatchObject(responseSchema));

        test('Doesn´t create a new rating', () => expect(sameScoreRatingCreation.ratingsCount).toBe(1));

        test('Updates rating fields', () => {
          expect(sameScoreRatingCreation.rating).toMatchObject({
            score,
            ratingUserId: ratingUser.id,
            weetId: weet.id
          });
        });
      });

      describe('When a score is added to the same weet with an other user', () => {
        test('Responds with 201 status code', () =>
          expect(ratingFromAnotherUserCreation.response.statusCode).toBe(201));

        test('Responds with the expected schema', () =>
          expect(ratingFromAnotherUserCreation.response.body).toMatchObject(responseSchema));

        test('Creates a new rating', () => expect(ratingFromAnotherUserCreation.ratingsCount).toBe(2));

        test('Creates the expected rating', () => {
          expect(ratingFromAnotherUserCreation.rating).toMatchObject({
            score: anotherScore,
            ratingUserId: anotherRatingUser.id,
            weetId: weet.id
          });
        });

        test('Updates ratedUser points with the expected value', () =>
          expect(ratingFromAnotherUserCreation.ratedUserPoints).toBe(differentScore + anotherScore));
      });

      describe('With invalid parameters', () => {
        test('Responds with 422 status code', () => expect(invalidParameters.response.statusCode).toBe(422));

        test('Responds with the expected error code', () =>
          expect(invalidParameters.response.body.internal_code).toBe(FIELD_VALIDATION_ERROR));
      });
    });
  });

  describe('With an invalid token', () => {
    beforeAll(async () => {
      const { token } = tokenFromUser({ externalId: 'undefined@wolox.com.ar', role: 'user' }, jwksMock);
      createRatingResponse = await httpRequest({ weetId: 1, token, body: { score: 1 } });
    });

    test('Responds with 401 status code', () => expect(createRatingResponse.statusCode).toBe(401));

    test('Responds with the expected error code', () =>
      expect(createRatingResponse.body.internal_code).toBe(AUTHORIZATION_ERROR));
  });

  describe('Without an user logged in', () => {
    beforeAll(async () => {
      createRatingResponse = await httpRequest({ weetId: 1, body: { score: 1 } });
    });

    test('Responds with 401 status code', () => expect(createRatingResponse.statusCode).toBe(401));

    test('Responds with the expected error code', () =>
      expect(createRatingResponse.body.internal_code).toBe(AUTHORIZATION_ERROR));
  });
});
