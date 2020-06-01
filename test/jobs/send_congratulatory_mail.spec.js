const sendCongratulatoryMail = require('../../app/jobs/send_congratulatory_mail');
const { createManyUsers } = require('../factory/users_factory');
const { truncateDatabase } = require('../utils');
const { mockMailSending } = require('../mocks/mailer');

describe('sendCongratulatoryMail', () => {
  const usersLength = 10;
  let mailSendMock = {};
  let users = {};
  beforeAll(async () => {
    users = await createManyUsers(usersLength);
    mailSendMock = mockMailSending();
    await sendCongratulatoryMail();
  });
  afterAll(() => truncateDatabase());

  test('Calls mail sender mock the expected times', () => {
    expect(mailSendMock).toHaveBeenCalledTimes(usersLength);
  });

  test('Calls mail sender with the expected user emails', () => {
    const usersEmails = users.map(user => user.email);
    expect(mailSendMock.mock.calls.flatMap(([user]) => user.to)).toIncludeSameMembers(usersEmails);
  });
});
