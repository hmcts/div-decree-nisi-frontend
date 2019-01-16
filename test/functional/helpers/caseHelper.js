const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);
const config = require('config');
const util = require('util');
const idamConfigHelper = require('./idamConfigHelper');
const caseConfigHelper = require('./caseConfigHelper');
const divTestHarness = require('@hmcts/div-test-harness');

let Helper = codecept_helper; // eslint-disable-line

class CaseHelper extends Helper {
  createDnCaseForUser(caseData) {
    caseData.D8PetitionerEmail = idamConfigHelper.getTestEmail();

    const params = {
      baseUrl: config.services.caseMaintenance.baseUrl,
      authToken: idamConfigHelper.getTestToken(),
      caseData
    };

    return divTestHarness.createDnCase(params, config.tests.functional.proxy)
      .then(createCaseResponse => {
        logger.info(`Created case ${createCaseResponse.id} for ${idamConfigHelper.getTestEmail()}`);
        caseConfigHelper.setTestCaseId(createCaseResponse.id);
      })
      .catch(error => {
        logger.info(`Error creating case: ${util.inspect(error)}`);
      });
  }
}

module.exports = CaseHelper;
