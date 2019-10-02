const modulePath = 'steps/done/Done.step';

const Done = require(modulePath);
const DoneContent = require('steps/done/Done.content');
const idam = require('services/idam');
const { custom, expect, middleware, sinon, content } = require('@hmcts/one-per-page-test-suite');
const httpStatus = require('http-status-codes');
const { getExpectedCourtsList, testDivorceUnitDetailsRender,
  testCTSCDetailsRender } = require('test/unit/helpers/courtInformation');
const config = require('config');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect and idam.logout middleware', () => {
    return middleware.hasMiddleware(Done, [idam.protect(), idam.logout()]);
  });


  describe('content for decree nisi application', () => {
    it('correct content', () => {
      const ignoreContent = [
        'clarificationCourtFeedback',
        'clarificationResponseSubmitted',
        'clarificationNext',
        'clarificationYourResponse',
        'clarificationContactUs',
        'downloadDocuments',
        'downloadAndSaveYourDocuments',
        'files',
        'webChatTitle',
        'chatDown',
        'chatWithAnAgent',
        'noAgentsAvailable',
        'allAgentsBusy',
        'chatClosed',
        'chatAlreadyOpen',
        'chatOpeningHours',
        'continue',
        'careOf'
      ];
      const session = { case: { data: {} } };
      return content(Done, session, { ignoreContent });
    });

    it('does not display and clarification content', () => {
      const specificContentToNotExist = [
        'clarificationCourtFeedback',
        'clarificationResponseSubmitted',
        'clarificationNext',
        'clarificationYourResponse',
        'clarificationContactUs',
        'downloadDocuments',
        'downloadAndSaveYourDocuments',
        'files'
      ];
      const session = { case: { data: {} } };
      return content(Done, session, { specificContentToNotExist });
    });
  });

  describe('content for clarification when awaitingClarification is enabled', () => {
    let sandbox = {};

    before(() => {
      sandbox = sinon.createSandbox();
      sandbox.stub(config, 'features').value({
        awaitingClarification: true
      });
    });

    after(() => {
      sandbox.restore();
    });

    let session = {};
    beforeEach(() => {
      session = {
        case: {
          state: 'AwaitingClarification',
          data: {
            d8: [
              {
                id: '401ab79e-34cb-4570-9f2f-4cf9357m4st3r',
                fileName: 'd8petition1554740111371638.pdf',
                // eslint-disable-next-line max-len
                fileUrl: 'http://dm-store-aat.service.core-compute-aat.internal/documents/30acaa2f-84d7-4e27-adb3-69551560113f'
              },
              {
                id: '401ab79e-34cb-4570-9124-4cf9357m4st3r',
                fileName: 'certificateOfEntitlement1559143445687032.pdf',
                // eslint-disable-next-line max-len
                fileUrl: 'http://dm-store-aat.service.core-compute-aat.internal/documents/30acaa2f-84d7-4e27-adb3-69551560113f'
              },
              {
                id: '401ab79e-34cb-4570-9124-4cf9357m4st3r',
                fileName: 'costsOrder1559143445687032.pdf',
                // eslint-disable-next-line max-len
                fileUrl: 'http://dm-store-aat.service.core-compute-aat.internal/documents/30acaa2f-84d7-4e27-adb3-69551560113f'
              },
              {
                id: '401ab79e-34cb-4570-9124-4cf9357m4st3r',
                fileName: 'decreeNisi1559143445687032.pdf',
                // eslint-disable-next-line max-len
                fileUrl: 'http://dm-store-aat.service.core-compute-aat.internal/documents/30acaa2f-84d7-4e27-adb3-69551560113f'
              },
              {
                id: '401ab79e-34cb-4570-9124-4cf9357m4st3r',
                fileName: 'dnAnswers1559143445687032.pdf',
                // eslint-disable-next-line max-len
                fileUrl: 'http://dm-store-aat.service.core-compute-aat.internal/documents/30acaa2f-84d7-4e27-adb3-69551560113f'
              },
              {
                id: '401ab79e-34cb-4570-9124-4cf9357m4st362',
                fileName: 'decreeNisiRefusalOrder1559143445687032.pdf',
                // eslint-disable-next-line max-len
                fileUrl: 'http://dm-store-aat.service.core-compute-aat.internal/documents/30acaa2f-84d7-4e27-adb3-69551560463'
              },
              {
                id: '401ab79e-34cb-4570-9124-4cf9357m4st362',
                fileName: 'coRespondentAnswers1559143445687032.pdf',
                // eslint-disable-next-line max-len
                fileUrl: 'http://dm-store-aat.service.core-compute-aat.internal/documents/30acaa2f-84d7-4e27-adb3-69551560333'
              },
              {
                id: '401ab79e-34cb-4570-9124-4cf9357m4st362',
                fileName: 'respondentAnswers1559143445687032.pdf',
                // eslint-disable-next-line max-len
                fileUrl: 'http://dm-store-aat.service.core-compute-aat.internal/documents/30acaa2f-84d7-4e27-adb3-69551560222'
              }
            ]
          }
        }
      };
    });

    it('should show correct content', () => {
      const specificContent = [
        'clarificationResponseSubmitted',
        'clarificationNext',
        'clarificationYourResponse',
        'clarificationContactUs',
        'downloadDocuments',
        'files.dpetition',
        'files.respondentAnswers',
        'files.coRespondentAnswers',
        'files.certificateOfEntitlement',
        'files.costsOrder',
        'files.decreeNisi',
        'files.dnAnswers',
        'files.decreeNisiRefusalOrder'
      ];

      return content(Done, session, { specificContent });
    });
  });

  describe(
    'does not show content for Awaiting Clarification if awaitingClarification is disabled',
    () => {
      let sandbox = {};

      before(() => {
        sandbox = sinon.createSandbox();
        sandbox.stub(config, 'features').value({
          awaitingClarification: false
        });
      });

      after(() => {
        sandbox.restore();
      });

      it('does not display and clarification content', () => {
        const specificContentToNotExist = [
          'clarificationCourtFeedback',
          'clarificationResponseSubmitted',
          'clarificationNext',
          'clarificationYourResponse',
          'clarificationContactUs',
          'downloadDocuments',
          'downloadAndSaveYourDocuments',
          'files'
        ];
        const session = { case: { state: 'AwaitingClarification', data: {} } };
        return content(Done, session, { specificContentToNotExist });
      });
    }
  );

  describe('values', () => {
    it('displays reference number', () => {
      const session = {
        case: {
          data: {
            caseReference: 'LV17D80101'
          }
        }
      };
      return content(
        Done,
        session,
        {
          specificValues: [ session.case.data.caseReference ]
        }
      );
    });

    describe('court address details', () => {
      it('should display divorce center details when divorce unit handles case', () => {
        const session = {
          case: {
            data: {
              courts: 'westMidlands',
              court: getExpectedCourtsList()
            }
          }
        };

        return custom(Done)
          .withSession(session)
          .get()
          .expect(httpStatus.OK)
          .html($ => {
            const rightHandSideMenu = $('.govuk-grid-column-one-third').html();

            testDivorceUnitDetailsRender(rightHandSideMenu);
            expect(rightHandSideMenu).to.include(DoneContent.en.openTimes)
              .and.to.include(DoneContent.en.divorceEmail)
              .and.to.include(DoneContent.en.phoneNumber);
          });
      });

      it('should display service center details when service centre handles case', () => {
        const session = {
          case: {
            data: {
              courts: 'serviceCentre',
              court: getExpectedCourtsList()
            }
          }
        };

        return custom(Done)
          .withSession(session)
          .get()
          .expect(httpStatus.OK)
          .html($ => {
            const rightHandSideMenu = $('.govuk-grid-column-one-third').html();

            testCTSCDetailsRender(rightHandSideMenu);
            expect(rightHandSideMenu).to.include(DoneContent.en.openTimes)
              .and.to.include(DoneContent.en.divorceEmail)
              .and.to.include(DoneContent.en.phoneNumber);
          });
      });
    });

    it('displays petitioner email', () => {
      const session = { case: { data: { petitionerEmail: 'petitioner@email.com' } } };
      return content(
        Done,
        session,
        {
          specificValues: [session.case.data.petitionerEmail]
        }
      );
    });
  });
});