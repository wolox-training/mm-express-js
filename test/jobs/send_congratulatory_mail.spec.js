const moment = require('moment');
const { times } = require('lodash');

const sendCongratulatoryMail = require('../../app/jobs/send_congratulatory_mail');
const { createManyUsers } = require('../factory/users_factory');
const { createManyWeets, createWeetWithWordsCount } = require('../factory/weets_factory');
const { truncateDatabase } = require('../utils');
const { mockMailSending } = require('../mocks/mailer');

describe('sendCongratulatoryMail', () => {
  const usersLength = 11;
  const limit = 10;
  let mailSendMock = {};
  let users = {};
  const createWeetsForUser = (user, weetsCount, wordsCount) =>
    Promise.all(times(weetsCount, () => createWeetWithWordsCount({ userId: user.id, wordsCount })));

  beforeAll(async () => {
    users = await createManyUsers(usersLength);
    await createManyWeets(3, { userId: users[0].id, createdAt: moment().subtract(2, 'days') });
    await Promise.all(users.map((user, index) => createWeetsForUser(user, index, index)));
    mailSendMock = mockMailSending();
    await sendCongratulatoryMail();
  });
  afterAll(() => truncateDatabase());

  test('Calls mail sender mock the expected times', () => {
    expect(mailSendMock).toHaveBeenCalledTimes(limit);
  });

  test('Calls mail sender with the expected user emails', () => {
    const usersEmails = users
      .reverse()
      .map(user => user.email)
      .slice(0, limit);
    expect(mailSendMock.mock.calls.flatMap(([user]) => user.to)).toIncludeSameMembers(usersEmails);
  });
});
