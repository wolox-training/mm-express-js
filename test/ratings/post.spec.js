const request = require('supertest');
const { sample } = require('lodash');

const app = require('../../app');
const { Rating } = require('../../app/models');
const { createUser } = require('../factory/users_factory');
const { createWeet } = require('../factory/weets_factory');
const { AUTHORIZATION_ERROR, FIELD_VALIDATION_ERROR, RESOURCE_NOT_FOUND_ERROR } = require('../../app/errors');
const { truncateDatabase } = require('../utils');
const { authorizedUserWithToken, tokenFromUser } = require('../helpers/authorized_user');

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

  const reloadedUserPoints = user => user.reload().then(reloadedUser => reloadedUser.points);

  describe('With an user logged in', () => {
    const score = sample([-1, 1]);
    let ratingUser = {};
    let ratedUser = {};
    let weet = {};
    let token = {};

    describe('When the requested weet doesn´t exist', () => {
      beforeAll(async () => {
        ({ user: ratingUser, token } = await authorizedUserWithToken());
        ratedUser = await createUser();
        createRatingResponse = await httpRequest({ token, weetId: 100, body: { score } });
      });
      afterAll(() => truncateDatabase());

      test('Responds with 404 status code', () => expect(createRatingResponse.statusCode).toBe(404));

      test('Responds with the expected error code', () =>
        expect(createRatingResponse.body.internal_code).toBe(RESOURCE_NOT_FOUND_ERROR));
    });

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

      test('Modifies ratedUser points by the score', () =>
        expect(reloadedUserPoints(ratedUser)).resolves.toBe(score));
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
          expect(reloadedUserPoints(ratedUser)).resolves.toBe(newScore));
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

      describe('When a score is added to the same weet with an other user', () => {
        const anotherScore = sample([-1, 1]);
        let anotherRatingUser = {};
        let anotherToken = {};

        beforeAll(async () => {
          ({ user: ratingUser, token } = await authorizedUserWithToken());
          ({ user: anotherRatingUser, token: anotherToken } = await authorizedUserWithToken());
          ratedUser = await createUser();
          weet = await createWeet({ userId: ratedUser.id });
          await httpRequest({ token, weetId: weet.id, body: { score } });
          createRatingResponse = await httpRequest({
            token: anotherToken,
            weetId: weet.id,
            body: { score: anotherScore }
          });
        });
        afterAll(() => truncateDatabase());

        test('Responds with 201 status code', () => expect(createRatingResponse.statusCode).toBe(201));

        test('Responds with the expected schema', () =>
          expect(createRatingResponse.body).toMatchObject(responseSchema));

        test('Creates a new rating', () => expect(Rating.count()).resolves.toBe(2));

        test('Creates the expected rating', async () => {
          const rating = await Rating.findByPk(createRatingResponse.body.id);
          expect(rating).toMatchObject({
            score: anotherScore,
            ratingUserId: anotherRatingUser.id,
            weetId: weet.id
          });
        });

        test('Updates ratedUser points with the expected value', () =>
          expect(reloadedUserPoints(ratedUser)).resolves.toBe(score + anotherScore));
      });

      describe('With invalid parameters', () => {
        const body = { score: 1231 };

        beforeAll(async () => {
          ({ user: ratingUser, token } = await authorizedUserWithToken());
          ratedUser = await createUser();
          weet = await createWeet({ userId: ratedUser.id });
          createRatingResponse = await httpRequest({ token, weetId: weet.id, body });
        });
        afterAll(() => truncateDatabase());

        test('Responds with 422 status code', () => expect(createRatingResponse.statusCode).toBe(422));

        test('Responds with the expected error code', () =>
          expect(createRatingResponse.body.internal_code).toBe(FIELD_VALIDATION_ERROR));
      });
    });
  });

  describe('With an invalid token', () => {
    beforeAll(async () => {
      const { token } = tokenFromUser({ email: 'undefined@wolox.com.ar', role: 'user' });
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
