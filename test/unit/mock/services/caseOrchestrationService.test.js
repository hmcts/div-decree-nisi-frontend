const moduleName = 'mocks/services/caseOrchestrationService';

const mockCaseOrchestrationService = require(moduleName);
const getSessionResponse = require('mocks/stubs/getSessionResponse');
const submitApplicationresponse = require('mocks/stubs/submitApplicationResponse');
const { expect } = require('@hmcts/one-per-page-test-suite');

describe(moduleName, () => {
  it('returns response when getting session', () => {
    return mockCaseOrchestrationService
      .getApplication()
      .then(response => {
        expect(response).to.eql({ case: getSessionResponse });
      });
  });

  it('returns response when submitting application', () => {
    return mockCaseOrchestrationService
      .submitApplication()
      .then(response => {
        expect(response).to.eql(submitApplicationresponse);
      });
  });
});
