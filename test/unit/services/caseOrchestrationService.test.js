const moduleName = 'services/caseOrchestrationService';

const caseOrchestrationService = require(moduleName);
const { expect } = require('@hmcts/one-per-page-test-suite');

describe(moduleName, () => {
  it('defines get application', () => {
    expect(caseOrchestrationService.hasOwnProperty('getApplication')).to.eql(true);
  });
  it('defines submit application', () => {
    expect(caseOrchestrationService.hasOwnProperty('submitApplication')).to.eql(true);
  });
});
