const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);
const randomstring = require('randomstring');
const idamExpressTestHarness = require('@hmcts/div-idam-test-harness');
const idamConfigHelper = require('./idamConfigHelper');
const request = require('request-promise-native');

const Helper = codecept_helper; // eslint-disable-line
const args = idamConfigHelper.getArgs();

class IdamHelper extends Helper {
  _before() {
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
      })
      .catch(error => {
        logger.error(`Unable to create IDAM test user: ${error}`);
      });
  }

  _after() {
    return idamExpressTestHarness.removeUser(args)
      .then(() => {
        logger.info(`Removed IDAM test user: ${args.testEmail}`);
      })
      .catch(error => {
        logger.error(`Unable to remove IDAM test user: ${error}`);
      });
  }
}

module.exports = IdamHelper;
