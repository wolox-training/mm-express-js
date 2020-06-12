const { CronJob } = require('cron');

const sendCongratulatoryMail = require('./send_congratulatory_mail');

exports.init = () => {
  const jobs = [new CronJob('0 0 * * *', sendCongratulatoryMail)];
  jobs.forEach(job => job.start());
};
