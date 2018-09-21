const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);
const randomstring = require('randomstring');
const idamExpressTestHarness = require('@hmcts/div-idam-test-harness');
const idamConfigHelper = require('./idamConfigHelper');

const request = require('request-promise-native');

const Helper = codecept_helper; // eslint-disable-line
const args = idamConfigHelper.getArgs();

class IdamHelper extends Helper {
  _before() {
    request.get('https://idam.preprod.ccidam.reform.hmcts.net').then(response => {
      console.log(response); // eslint-disable-line no-console
    });

    logger.info('BEFORE BLOCK IS RUN');
    console.log('Before block is run'); // eslint-disable-line no-console

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

    logger.info('About to create a new user');
    console.log('About to create new user'); // eslint-disable-line no-console

    return idamExpressTestHarness.createUser(args)
      .then(() => {
        logger.info(`Created IDAM test user: ${testEmail}`);
        console.log('Created'); // eslint-disable-line no-console
      })
      .catch(error => {
        logger.error(`Unable to create IDAM test user: ${error}`);
        console.log('Failed create'); // eslint-disable-line no-console
        console.log(error); // eslint-disable-line no-console
      });
  }

  _after() {
    console.log('About to delete new user'); // eslint-disable-line no-console
    return idamExpressTestHarness.removeUser(args)
      .then(() => {
        logger.info(`Removed IDAM test user: ${args.testEmail}`);
        console.log('Deleted'); // eslint-disable-line no-console
      })
      .catch(error => {
        logger.error(`Unable to remove IDAM test user: ${error}`);
        console.log('Failed delete'); // eslint-disable-line no-console
        console.log(error); // eslint-disable-line no-console
      });
  }
}

module.exports = IdamHelper;
