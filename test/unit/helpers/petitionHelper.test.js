const { expect } = require('@hmcts/one-per-page-test-suite');

const modulePath = 'helpers/petitionHelper';
const { dnAwaitingTemplate } = require('steps/petition-progress-bar/petitionerStateTemplates');
const {
  constants,
  isAwaitingDecreeNisi,
  isAwaitingPronouncementWithHearingDate,
  isProcessServerService,
  isServedByProcessServer,
  isReceivedAOSFromRespondent,
  isPetitionerRepresented,
  getProcessServerReason
} = require('helpers/petitionHelper');

describe(modulePath, () => {
  let pageInstance = {};

  before(() => {
    pageInstance = {
      case: {
        state: 'AwaitingDecreeNisi',
        data: {
          servedByProcessServer: 'Yes',
          receivedAOSfromResp: 'No',
          permittedDecreeNisiReason: '3',
          hearingDate: ['2022-04-25T00:00:00.000Z']
        }
      }
    };
  });

  it('should return false if AOS has not been received', () => {
    expect(isReceivedAOSFromRespondent(pageInstance.case.data)).to.equal(false);
  });

  it('should return true if process server has been served', () => {
    expect(isServedByProcessServer(pageInstance.case.data)).to.equal(true);
  });

  it('should return true if process server is served and no response from respondent', () => {
    expect(isProcessServerService(pageInstance.case.data)).to.equal(true);
  });

  it('should return true if awaiting hearingDate is set', () => {
    const newPageInstance = Object.assign({}, pageInstance);
    expect(isAwaitingPronouncementWithHearingDate('AwaitingPronouncement', newPageInstance.case.data)).to.equal(true);
  });

  it('should return true if case is awaiting decree nisi', () => {
    expect(isAwaitingDecreeNisi(constants.DNAwaiting)).to.equal(true);
  });

  it('should return false when petitioner solicitor email is empty', () => {
    expect(isPetitionerRepresented(pageInstance.case.data)).to.equal(false);
  });

  it('should return correct process server template index key value', () => {
    expect(getProcessServerReason()).to.equal(dnAwaitingTemplate.servedByProcessServer);
  });
});
