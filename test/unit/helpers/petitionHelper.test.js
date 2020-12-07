const { expect } = require('@hmcts/one-per-page-test-suite');

const modulePath = 'helpers/petitionHelper';
const { dnAwaitingTemplate } = require('steps/petition-progress-bar/petitionerStateTemplates');
const {
  constants,
  isAwaitingDecreeNisi,
  isAwaitingPronouncementWithHearingDate,
  isProcessServerService,
  isServedByProcessServer,
  isReceivedAosFromRespondent,
  isPetitionerRepresented,
  getProcessServerReason,
  isDeemedServiceApplicationGranted,
  isDispensedServiceApplicationGranted,
  isServedByAlternativeMethod
} = require('helpers/petitionHelper');

describe(modulePath, () => {
  let session = {};

  beforeEach(() => {
    session = {
      case: {
        state: 'AwaitingDecreeNisi',
        data: {
          servedByProcessServer: 'Yes',
          receivedAosFromResp: 'No',
          permittedDecreeNisiReason: '3',
          hearingDate: ['2022-04-25T00:00:00.000Z']
        }
      }
    };
  });

  it('should return false if AOS has not been received', () => {
    expect(isReceivedAosFromRespondent(session.case.data)).to.equal(false);
  });

  it('should return true if AOS has been received', () => {
    session.case.data.receivedAosFromResp = 'Yes';

    expect(isReceivedAosFromRespondent(session.case.data)).to.equal(true);
  });

  it('should return false if AOS received does not exist', () => {
    const newSession = Object.assign({}, session);
    delete newSession.case.data.receivedAosFromResp;

    expect(isReceivedAosFromRespondent(newSession.case.data)).to.equal(false);
  });

  it('should return true if process server has been served', () => {
    expect(isServedByProcessServer(session.case.data)).to.equal(true);
  });

  it('should return false if process server has not been served', () => {
    session.case.data.servedByProcessServer = 'No';
    expect(isServedByProcessServer(session.case.data)).to.equal(false);
  });

  it('should return false if process server does not exist', () => {
    const newSession = Object.assign({}, session);
    delete newSession.case.data.servedByProcessServer;

    expect(isServedByProcessServer(session.case.data)).to.equal(false);
  });

  it('should return true if process server is served and no response from respondent', () => {
    expect(isProcessServerService(session.case.data)).to.equal(true);
  });

  it('should return false petitioner is represented', () => {
    const newSession = Object.assign({}, session);
    newSession.case.data.petitionerSolicitorEmail = 'solicitor@email.com';

    expect(isProcessServerService(newSession.case.data)).to.equal(false);
  });

  it('should return true if awaiting hearingDate is set', () => {
    const newSession = Object.assign({}, session);

    expect(isAwaitingPronouncementWithHearingDate('AwaitingPronouncement', newSession.case.data)).to.equal(true);
  });

  it('should return true if case is awaiting decree nisi', () => {
    expect(isAwaitingDecreeNisi(constants.DNAwaiting)).to.equal(true);
  });

  it('should return false if case is not awaiting decree nisi', () => {
    expect(isAwaitingDecreeNisi('AnotherState')).to.equal(false);
  });

  it('should return false when petitioner solicitor email is empty', () => {
    expect(isPetitionerRepresented(session.case.data)).to.equal(false);
  });

  it('should return true when petitioner solicitor email is not empty', () => {
    session.case.data.petitionerSolicitorEmail = 'solicitor@email.com';
    expect(isPetitionerRepresented(session.case.data)).to.equal(true);
  });

  it('should return correct process server template index key value', () => {
    expect(getProcessServerReason()).to.equal(dnAwaitingTemplate.servedByProcessServer);
  });

  it('should return true when deemed service has been granted', () => {
    const newSession = Object.assign({}, session);
    newSession.case.data.serviceApplicationGranted = constants.yes;
    newSession.case.data.serviceApplicationType = constants.deemed;

    expect(isDeemedServiceApplicationGranted(newSession.case.data)).to.equal(true);
  });

  it('should return true when dispensed service has been granted', () => {
    const newSession = Object.assign({}, session);
    newSession.case.data.serviceApplicationGranted = constants.yes;
    newSession.case.data.serviceApplicationType = constants.dispensed;

    expect(isDispensedServiceApplicationGranted(newSession.case.data)).to.equal(true);
  });

  describe('Served by alternative method: ', () => {
    beforeEach(() => {
      session = {
        case: {
          state: 'AwaitingDecreeNisi',
          data: {
            servedByAlternativeMethod: 'Yes',
            receivedAosFromResp: 'No',
            permittedDecreeNisiReason: '8'
          }
        }
      };
    });

    describe('Valid Scenario', () => {
      it('should return true if all conditions are valid', () => {
        session.case.data.servedByAlternativeMethod = 'Yes';
        session.case.data.petitionerSolicitorEmail = null;
        session.case.data.receivedAosFromResp = 'something';

        expect(isServedByAlternativeMethod(session.case.data)).to.equal(true);
      });

      it('AC2: Served by alternative method and AOS received within 7 days', () => {
        session.case.data.servedByAlternativeMethod = 'Yes';
        session.case.data.receivedAosFromResp = 'something';

        expect(isServedByAlternativeMethod(session.case.data)).to.equal(true);
      });
    });

    describe('Invalid scenario', () => {
      it('should return false if not in AwaitingDecreeNisi state', () => {
        expect(isServedByAlternativeMethod('AnotherState')).to.equal(false);
      });

      it('should return false if not served by alternative method', () => {
        session.case.data.servedByAlternativeMethod = 'No';

        expect(isServedByAlternativeMethod(session.case)).to.equal(false);
      });

      it('should return false if petitioner is represented by a solicitor', () => {
        session.case.data.petitionerSolicitorEmail = 'petsolicitor@mail.com';

        expect(isServedByAlternativeMethod(session.case)).to.equal(false);
      });

      it('should return false if AoS has been received from respondent', () => {
        session.case.data.receivedAosFromResp = 'Yes';

        expect(isServedByAlternativeMethod(session.case)).to.equal(false);
      });
    });
  });
});
