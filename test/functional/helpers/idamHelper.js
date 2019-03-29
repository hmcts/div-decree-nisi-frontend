const config = require('config');
const logger = require('services/logger').getLogger(__filename);
const randomstring = require('randomstring');
const idamExpressTestHarness = require('@hmcts/div-idam-test-harness');
const idamConfigHelper = require('./idamConfigHelper');
const { parseBool } = require('@hmcts/one-per-page/util');

const Helper = codecept_helper; // eslint-disable-line

const redirectUri = `${config.tests.functional.url}${config.paths.authenticated}`;
const idamArgs = {
  redirectUri,
  indexUrl: config.paths.index,
  idamApiUrl: config.services.idam.apiUrl,
  idamLoginUrl: config.services.idam.loginUrl,
  idamSecret: config.services.idam.secret,
  idamClientID: config.services.idam.clientId
};

class IdamHelper extends Helper {
  createAUser() {
    if (parseBool(config.features.idam)) {
      const randomString = randomstring.generate({
        length: 16,
        charset: 'numeric'
      });
      const emailName = `divorce+dn-test-${randomString}`;
      const testEmail = `${emailName}@example.com`;
      const testPassword = 'genericPassword123';

      idamArgs.testEmail = testEmail;
      idamArgs.testPassword = testPassword;
      idamArgs.testGroupCode = 'citizens';
      idamArgs.roles = [{ code: 'citizen' }];

      idamConfigHelper.setTestEmail(testEmail);
      idamConfigHelper.setTestPassword(testPassword);
      return idamExpressTestHarness.createUser(idamArgs, config.tests.functional.proxy)
        .then(() => {
          logger.infoWithReq(
            null,
            'idam_user_created',
            `Created IDAM test user: ${testEmail}`
          );
          return idamExpressTestHarness.getToken(idamArgs, config.tests.functional.proxy);
        })
        .then(response => {
          logger.infoWithReq(
            null,
            'idam_user_created',
            `Retrieved IDAM test user token: ${testEmail}`
          );
          idamConfigHelper.setTestToken(response.access_token);
          idamArgs.accessToken = response.access_token;
          return idamExpressTestHarness.generatePin(idamArgs, config.tests.functional.proxy);
        })
        .then(response => {
          logger.infoWithReq(
            null,
            'idam_user_created',
            `Retrieved IDAM test user pin: ${testEmail}`
          );
          idamConfigHelper.setPin(response.pin);
        })
        .catch(error => {
          logger.warnWithReq(
            null, 'idam_user_created',
            'Unable to create IDAM test user/token',
            error
          );
          throw error;
        });
    }
    return Promise.resolve({});
  }

  _after() {
    if (parseBool(config.features.idam)) {
      idamExpressTestHarness.removeUser(idamArgs, config.tests.functional.proxy)
        .then(() => {
          logger.infoWithReq(
            null,
            'idam_user_removed',
            `Removed IDAM test user: ${idamArgs.testEmail}`
          );
        })
        .catch(error => {
          logger.warnWithReq(
            null,
            'idam_user_remove_error',
            'Unable to remove IDAM test user',
            error
          );
        });
    }
  }
}

module.exports = IdamHelper;