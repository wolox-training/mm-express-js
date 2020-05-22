const request = require('supertest');
const { sample } = require('lodash');

const app = require('../../app');
const { Rating } = require('../../app/models');
const { createUser } = require('../factory/users_factory');
const { createWeet } = require('../factory/weets_factory');
const { AUTHORIZATION_ERROR } = require('../../app/errors');
const { truncateDatabase } = require('../utils');
const { authorizedUserWithToken } = require('../helpers/authorized_user');

describe('POST /weets/:id/ratings', () => {
  let createRatingResponse = {};
  const httpRequest = ({ token, weetId, body } = {}) => {
    const requestBuilder = request(app)
      .post(`/weets/${weetId}/ratings`)
      .send(body);
    return token ? requestBuilder.set('Authorization', `Bearer ${token}`) : requestBuilder;
  };

  const responseSchema = {
    id: expect.any(Number),
    score: expect.any(Number),
    rating_user_id: expect.any(Number),
    weet_id: expect.any(Number)
  };

  describe('With an user logged in', () => {
    const score = sample([-1, 1]);
    let ratingUser = {};
    let ratedUser = {};
    let weet = {};
    let token = {};

    describe('When creating the first rating', () => {
      beforeAll(async () => {
        ({ user: ratingUser, token } = await authorizedUserWithToken());
        ratedUser = await createUser();
        weet = await createWeet({ userId: ratedUser.id });
        createRatingResponse = await httpRequest({ token, weetId: weet.id, body: { score } });
      });
      afterAll(() => truncateDatabase());

      test('Responds with 201 status code', () => expect(createRatingResponse.statusCode).toBe(201));

      test('Responds with the expected schema', () =>
        expect(createRatingResponse.body).toMatchObject(responseSchema));

      test('Creates the expected rating', async () => {
        const rating = await Rating.findByPk(createRatingResponse.body.id);
        expect(rating).toMatchObject({
          score,
          ratingUserId: ratingUser.id,
          weetId: weet.id
        });
      });

      test('Modify ratedUser points by the score', () =>
        expect(ratedUser.reload().then(user => user.points)).resolves.toBe(score));
    });

    describe('When there is a previous rating belonging to this user and weet', () => {
      describe('When new score is different than the old score', () => {
        const newScore = -score;

        beforeAll(async () => {
          ({ user: ratingUser, token } = await authorizedUserWithToken());
          ratedUser = await createUser();
          weet = await createWeet({ userId: ratedUser.id });
          await httpRequest({ token, weetId: weet.id, body: { score } });
          createRatingResponse = await httpRequest({ token, weetId: weet.id, body: { score: newScore } });
        });
        afterAll(() => truncateDatabase());

        test('Responds with 201 status code', () => expect(createRatingResponse.statusCode).toBe(201));

        test('Responds with the expected schema', () =>
          expect(createRatingResponse.body).toMatchObject(responseSchema));

        test('Doesn´t create a new rating', () => expect(Rating.count()).resolves.toBe(1));

        test('Creates the expected rating', async () => {
          const rating = await Rating.findByPk(createRatingResponse.body.id);
          expect(rating).toMatchObject({
            score: newScore,
            ratingUserId: ratingUser.id,
            weetId: weet.id
          });
        });

        test('Updates the ratedUser points', () =>
          expect(ratedUser.reload().then(user => user.points)).resolves.toBe(newScore));
      });

      describe('When new score is the same than the old score', () => {
        beforeAll(async () => {
          ({ user: ratingUser, token } = await authorizedUserWithToken());
          ratedUser = await createUser();
          weet = await createWeet({ userId: ratedUser.id });
          await httpRequest({ token, weetId: weet.id, body: { score } });
          createRatingResponse = await httpRequest({ token, weetId: weet.id, body: { score } });
        });
        afterAll(() => truncateDatabase());

        test('Responds with 201 status code', () => expect(createRatingResponse.statusCode).toBe(201));

        test('Responds with the expected schema', () =>
          expect(createRatingResponse.body).toMatchObject(responseSchema));

        test('Doesn´t create a new rating', () => expect(Rating.count()).resolves.toBe(1));

        test('Creates the expected rating', async () => {
          const rating = await Rating.findByPk(createRatingResponse.body.id);
          expect(rating).toMatchObject({
            score,
            ratingUserId: ratingUser.id,
            weetId: weet.id
          });
        });
      });
    });
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
