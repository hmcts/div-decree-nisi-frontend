const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);
const randomstring = require('randomstring');
const idamExpressTestHarness = require('@hmcts/div-idam-test-harness');
const idamConfigHelper = require('./idamConfigHelper');

const Helper = codecept_helper; // eslint-disable-line
const args = idamConfigHelper.getArgs();
const config = require('config');

class IdamHelper extends Helper {
  _before() { // eslint-disable-line consistent-return
    if (config.environment !== 'development') {
      const randomString = randomstring.generate({
        length: 16,
        charset: 'numeric'
      });
      const emailName = `simulate-delivered-${randomString}`;
      const testEmail = `${emailName}@notifications.service.gov.uk`;
      const testPassword = randomstring.generate(9);

      args.testEmail = testEmail;
      args.testPassword = testPassword;

      idamConfigHelper.setTestEmail(testEmail);
      idamConfigHelper.setTestPassword(testPassword);

      return idamExpressTestHarness.createUser(args)
        .then(() => {
          logger.info(`Created IDAM test user: ${testEmail}`);
          console.log('Created IDAM test user: ${testEmail}'); // eslint-disable-line
        })
        .catch(error => {
          console.log('error creating idam user'); // eslint-disable-line
          console.log(error); // eslint-disable-line
          logger.warn(`Unable to create IDAM test user: ${error}`);
        });
    }
  }

  _after() { // eslint-disable-line consistent-return
    if (config.environment !== 'development') {
      return idamExpressTestHarness.removeUser(args)
        .then(() => {
          logger.info(`Removed IDAM test user: ${args.testEmail}`);
        })
        .catch(error => {
          logger.warn(`Unable to remove IDAM test user: ${error}`);
        });
    }
  }
}

module.exports = IdamHelper;
