const logger = require('services/logger').getLogger(__filename);
const config = require('config');
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
        logger.infoWithReq(null, 'case_created',
          'Case created',
          createCaseResponse.id,
          idamConfigHelper.getTestEmail()
        );
        caseConfigHelper.setTestCaseId(createCaseResponse.id);
      })
      .catch(error => {
        logger.infoWithReq(null, 'case_create_error',
          'Error creating case',
          error
        );
      });
  }
}

module.exports = CaseHelper;
