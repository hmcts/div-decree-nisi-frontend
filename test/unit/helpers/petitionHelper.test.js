const { expect } = require('@hmcts/one-per-page-test-suite');

const modulePath = 'helpers/petitionHelper';
const { dnAwaitingTemplate } = require('steps/petition-progress-bar/petitionerStateTemplates');
const {
  constants,
  isAwaitingDecreeNisi,
  isAwaitingPronouncementWithHearingDate,
  isProcessServerService,
  isServedByProcessServer,
  hasReceivedAosFromRespondent,
  isPetitionerRepresented,
  getProcessServerReason,
  isDeemedServiceApplicationGranted,
  isServedByBailiffSuccessfulAndAosNotReceived,
  isDispensedServiceApplicationGranted,
  isServedByAlternativeMethod
} = require('helpers/petitionHelper');

describe(modulePath, () => {
  let session = {};

  describe('Suite: Served by process server', () => {
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
      expect(hasReceivedAosFromRespondent(session.case.data)).to.equal(false);
    });

    it('should return true if AOS has been received', () => {
      session.case.data.receivedAosFromResp = 'Yes';

      expect(hasReceivedAosFromRespondent(session.case.data)).to.equal(true);
    });

    it('should return false if AOS received does not exist', () => {
      delete session.case.data.receivedAosFromResp;

      expect(hasReceivedAosFromRespondent(session.case.data)).to.equal(false);
    });

    it('should return true if process server has been served', () => {
      expect(isServedByProcessServer(session.case.data)).to.equal(true);
    });

    it('should return false if process server has not been served', () => {
      session.case.data.servedByProcessServer = 'No';
      expect(isServedByProcessServer(session.case.data)).to.equal(false);
    });

    it('should return false if process server does not exist', () => {
      delete session.case.data.servedByProcessServer;

      expect(isServedByProcessServer(session.case.data)).to.equal(false);
    });

    it('should return true if process server is served and no response from respondent', () => {
      expect(isProcessServerService(session.case.data)).to.equal(true);
    });

    it('should return false petitioner is represented', () => {
      session.case.data.petitionerSolicitorEmail = 'solicitor@email.com';

      expect(isProcessServerService(session.case.data)).to.equal(false);
    });

    it('should return true if awaiting hearingDate is set', () => {
      expect(isAwaitingPronouncementWithHearingDate('AwaitingPronouncement', session.case.data)).to.equal(true);
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
  });

  describe('Suite: Deemed and Dispensed', () => {
    beforeEach(() => {
      session = {
        case: {
          state: 'AwaitingDecreeNisi',
          data: {
            serviceApplicationGranted: 'Yes'
          }
        }
      };
    });

    it('should return true when deemed service has been granted', () => {
      session.case.data.serviceApplicationType = constants.deemed;

      expect(isDeemedServiceApplicationGranted(session.case.data)).to.equal(true);
    });

    it('should return true when dispensed service has been granted', () => {
      session.case.data.serviceApplicationType = constants.dispensed;

      expect(isDispensedServiceApplicationGranted(session.case.data)).to.equal(true);
    });

    it('should return false when deemed service has not been granted', () => {
      session.case.data.serviceApplicationGranted = 'No';

      expect(isDeemedServiceApplicationGranted(session.case.data)).to.equal(false);
    });

    it('should return false when dispensed service has not been granted', () => {
      session.case.data.serviceApplicationGranted = 'No';

      expect(isDispensedServiceApplicationGranted(session.case.data)).to.equal(false);
    });
  });

  describe('Suite: Served by alternative method', () => {
    beforeEach(() => {
      session = {
        case: {
          state: 'AwaitingDecreeNisi',
          data: {
            servedByAlternativeMethod: 'Yes',
            receivedAosFromResp: 'No',
            permittedDecreeNisiReason: '8',
            petitionerSolicitorEmail: null
          }
        }
      };
    });

    it('should return false if AOS has not been received', () => {
      expect(hasReceivedAosFromRespondent(session.case.data)).to.equal(false);
    });

    it('should return true when served by alt method and AOS not received', () => {
      expect(isServedByAlternativeMethod(session.case.data)).to.equal(true);
    });

    it('should return false when served by alt method and AOS received', () => {
      session.case.data.receivedAosFromResp = 'Yes';

      expect(isServedByAlternativeMethod(session.case.data)).to.equal(false);
    });

    it('should return false if petitioner is represented', () => {
      session.case.data.petitionerSolicitorEmail = 'solicitorEmail@mail.com';

      expect(isServedByAlternativeMethod(session.case.data)).to.equal(false);
    });

    it('should return false if not served by alternative method', () => {
      session.case.data.servedByAlternativeMethod = 'No';

      expect(isServedByAlternativeMethod(session.case.data)).to.equal(false);
    });
  });

  describe('Suite: Served by Bailiff Journey', () => {
    describe('Testing DNReason: isServedByBailiffSuccessfulAndAosNotReceived', () => {
      beforeEach(() => {
        session = {
          case: {
            state: 'AwaitingDecreeNisi',
            data: {
              successfulServedByBailiff: 'Yes',
              receivedAosFromResp: 'No',
              permittedDecreeNisiReason: '9'
            }
          }
        };
      });

      it('should return true when served by bailiff successfully and no AOS Response', () => {
        expect(isServedByBailiffSuccessfulAndAosNotReceived(session.case.data)).to.equal(true);
      });

      it('should return false when not served by bailiff successfully and no AOS Response', () => {
        session.case.data.successfulServedByBailiff = 'No';
        expect(isServedByBailiffSuccessfulAndAosNotReceived(session.case.data)).to.equal(false);
      });

      it('should return false if SuccessfulServedByBailiff does not exist', () => {
        delete session.case.data.successfulServedByBailiff;

        expect(isServedByBailiffSuccessfulAndAosNotReceived(session.case.data)).to.equal(false);
      });

      it('should return false when served by bailiff successfully and AOS Response has been responded to', () => {
        session.case.data.receivedAosFromResp = 'Yes';

        expect(isServedByBailiffSuccessfulAndAosNotReceived(session.case.data)).to.equal(false);
      });
    });
  });
});
