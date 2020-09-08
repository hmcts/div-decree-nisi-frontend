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
        'clarification',
        'clarificationCourtFeedback',
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
        'careOf',
        'backLink',
        'signIn',
        'languageToggle',
        'thereWasAProblem',
        'change',
        'husband',
        'wife'
      ];
      const session = { case: { data: {} } };
      return content(Done, session, { ignoreContent });
    });

    it('does not display and clarification content', () => {
      const specificContentToNotExist = [
        'clarification',
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
            dnOutcomeCase: true,
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
                fileName: 'rejectionDnRefusalOrder1559143445687032.pdf',
                // eslint-disable-next-line max-len
                fileUrl: 'http://dm-store-aat.service.core-compute-aat.internal/documents/30acaa2f-84d7-4e27-adb3-69551560463'
              },
              {
                id: '401ab79e-34cb-4570-9124-4cf9357m4st362',
                fileName: 'clarificationDnRefusalOrder1559143445687032.pdf',
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
              },
              {
                id: '4756b8b3-fb60-4dd4-a409-2ec91d09dd78',
                fileName: 'deemedAsServedGranted1559143445687032.pdf',
                // eslint-disable-next-line max-len
                fileUrl: 'http://dm-store-aat.service.core-compute-aat.internal/documents/4756b8b3-fb60-4dd4-a409-2ec91d09dd78'
              },
              {
                id: '79310942-3f30-4065-b68f-65d94fcdc6e8',
                fileName: 'dispenseWithServiceGranted1559143445687032.pdf',
                // eslint-disable-next-line max-len
                fileUrl: 'http://dm-store-aat.service.core-compute-aat.internal/documents/79310942-3f30-4065-b68f-65d94fcdc6e8'
              },
              {
                id: '79310942-3f30-4065-b68f-65d94fcdc6e8',
                fileName: 'aosOverdueCoverLetter1559143445687032.pdf',
                // eslint-disable-next-line max-len
                fileUrl: 'http://dm-store-aat.service.core-compute-aat.internal/documents/79310942-3f30-4065-b68f-65d94fcdc6e8'
              }
            ]
          }
        }
      };
    });

    describe('Share documents is true and has uploaded documents', () => {
      beforeEach(() => {
        session.ShareCourtDocuments = {
          upload: 'yes'
        };
        session.Upload = {
          files: [{ id: 'some-id' }]
        };
      });

      it('should show correct content', () => {
        const specificContent = [
          'clarification.responseSubmitted',
          'clarification.next',
          'clarification.noPostDocuments.responseCheckedByCourt',
          'clarification.noPostDocuments.contactUs',
          'clarification.needHelp',
          'clarification.contactDivorceCentre',
          'clarification.helpImprove',
          'clarification.helpImproveLink'
        ];
        return content(Done, session, { specificContent });
      });

      it('should not show content relating to posting documents', () => {
        const specificContentToNotExist = [
          'clarification.postDocuments.postDocuments',
          'clarification.postDocuments.youWantToSubmitDocs',
          'clarification.postDocuments.originalDocuments',
          'clarification.postDocuments.warning',
          'clarification.postDocuments.referenceNumber',
          'clarification.postDocuments.courtCheckResponse'
        ];
        return content(Done, session, { specificContentToNotExist });
      });
    });

    describe('Share documents is true and has NOT uploaded documents', () => {
      beforeEach(() => {
        session.ShareCourtDocuments = {
          upload: 'yes'
        };
      });

      it('show content regarding posting documents', () => {
        const specificContent = [
          'clarification.responseSubmitted',
          'clarification.next',
          'clarification.postDocuments.postDocuments',
          'clarification.postDocuments.youWantToSubmitDocs',
          'clarification.postDocuments.originalDocuments',
          'clarification.postDocuments.warning',
          'clarification.postDocuments.referenceNumber',
          'clarification.postDocuments.courtCheckResponse',
          'clarification.needHelp',
          'clarification.contactDivorceCentre',
          'clarification.helpImprove',
          'clarification.helpImproveLink'
        ];
        return content(Done, session, { specificContent });
      });
    });

    describe('Share documents is false', () => {
      it('should show correct content', () => {
        const specificContent = [
          'clarification.responseSubmitted',
          'clarification.next',
          'clarification.noPostDocuments.responseCheckedByCourt',
          'clarification.noPostDocuments.contactUs',
          'clarification.needHelp',
          'clarification.contactDivorceCentre',
          'clarification.helpImprove',
          'clarification.helpImproveLink'
        ];
        return content(Done, session, { specificContent });
      });

      it('should not show content relating to posting documents', () => {
        const specificContentToNotExist = [
          'clarification.postDocuments.postDocuments',
          'clarification.postDocuments.youWantToSubmitDocs',
          'clarification.postDocuments.originalDocuments',
          'clarification.postDocuments.warning',
          'clarification.postDocuments.referenceNumber',
          'clarification.postDocuments.courtCheckResponse'
        ];
        return content(Done, session, { specificContentToNotExist });
      });
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
          'clarification',
          'downloadDocuments',
          'downloadAndSaveYourDocuments',
          'files'
        ];
        const session = { case: { state: 'AwaitingClarification', data: { dnOutcomeCase: true } } };
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
