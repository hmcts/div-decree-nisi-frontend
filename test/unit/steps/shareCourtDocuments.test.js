const modulePath = 'steps/share-court-documents/ShareCourtDocuments.step';

const ShareCourtDocuments = require(modulePath);
const CheckYourAnswers = require('steps/check-your-answers/CheckYourAnswers.step');
const Upload = require('steps/upload/Upload.step');
const idam = require('services/idam');
const { middleware, question, sinon, content } = require('@hmcts/one-per-page-test-suite');
const config = require('config');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(ShareCourtDocuments, [ idam.protect() ]);
  });

  describe('Renders content', () => {
    it('renders the common content', () => {
      const session = { case: { data: {} } };
      const ignoreContent = [
        'webChatTitle',
        'chatDown',
        'chatWithAnAgent',
        'noAgentsAvailable',
        'allAgentsBusy',
        'chatClosed',
        'chatAlreadyOpen',
        'chatOpeningHours',
        'adultery',
        'otherReasons',
        'webChatTitle',
        'chatDown',
        'chatWithAnAgent',
        'noAgentsAvailable',
        'allAgentsBusy',
        'chatClosed',
        'chatAlreadyOpen',
        'chatOpeningHours',
        'clarificationCourtFeedback',
        'clarification',
        'signIn',
        'languageToggle',
        'thereWasAProblem',
        'change',
        'husband',
        'wife',
        'phoneToCallIfProblems'
      ];
      return content(ShareCourtDocuments, session, { ignoreContent });
    });

    it('renders the adultery related content', () => {
      const session = {
        case: {
          data: {
            reasonForDivorce: 'adultery',
            respAdmitOrConsentToFact: 'No'
          }
        }
      };
      const specificContent = [
        'adultery.title',
        'adultery.adulteryDoc',
        'adultery.extraDocs'
      ];
      return content(ShareCourtDocuments, session, { specificContent });
    });

    it('renders the other reasons for divorce related content', () => {
      const session = {
        case: {
          data: {
            reasonForDivorce: 'unreasonable-behaviour'
          }
        }
      };
      const specificContent = [
        'otherReasons.title',
        'otherReasons.extraDocuments'
      ];
      return content(ShareCourtDocuments, session, { specificContent });
    });

    describe(
      'clarification content feature:awaitingClarificiation is enabled, state is awaitingClarificiation', // eslint-disable-line
      () => {
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
              data: { dnOutcomeCase: true }
            }
          };
        });

        it('should show correct content', () => {
          const specificContent = [
            'clarification.title',
            'clarification.extraDocs'
          ];

          return content(ShareCourtDocuments, session, { specificContent });
        });

        describe('show refusal reasons content', () => {
          it('feedback for jurisdictionDetails', () => {
            session.case.data = {
              refusalClarificationReason: ['jurisdictionDetails'],
              dnOutcomeCase: true
            };
            const specificContent = [
              'clarificationCourtFeedback.jurisdictionDetails.title',
              'clarificationCourtFeedback.jurisdictionDetails.description'
            ];
            return content(ShareCourtDocuments, session, { specificContent });
          });

          it('feedback for marriageCertTranslation', () => {
            session.case.data = {
              refusalClarificationReason: ['marriageCertTranslation'],
              dnOutcomeCase: true
            };
            const specificContent = [
              'clarificationCourtFeedback.marriageCertTranslation.title',
              'clarificationCourtFeedback.marriageCertTranslation.description',
              'clarificationCourtFeedback.marriageCertTranslation.method1',
              'clarificationCourtFeedback.marriageCertTranslation.method2'
            ];
            return content(ShareCourtDocuments, session, { specificContent });
          });

          it('feedback for marriageCertificate', () => {
            session.case.data = {
              refusalClarificationReason: ['marriageCertificate'],
              dnOutcomeCase: true
            };
            const specificContent = [
              'clarificationCourtFeedback.marriageCertificate.title',
              'clarificationCourtFeedback.marriageCertificate.description'
            ];
            return content(ShareCourtDocuments, session, { specificContent });
          });

          it('feedback for previousProceedingDetails', () => {
            session.case.data = {
              refusalClarificationReason: ['previousProceedingDetails'],
              dnOutcomeCase: true
            };
            const specificContent = [
              'clarificationCourtFeedback.previousProceedingDetails.title',
              'clarificationCourtFeedback.previousProceedingDetails.description'
            ];
            return content(ShareCourtDocuments, session, { specificContent });
          });

          it('feedback for caseDetailsStatement', () => {
            session.case.data = {
              refusalClarificationReason: ['caseDetailsStatement'],
              dnOutcomeCase: true
            };
            const specificContent = [
              'clarificationCourtFeedback.caseDetailsStatement.title',
              'clarificationCourtFeedback.caseDetailsStatement.description'
            ];
            return content(ShareCourtDocuments, session, { specificContent });
          });

          it('feedback for other', () => {
            session.case.data = {
              dnOutcomeCase: true,
              refusalClarificationReason: ['other'],
              refusalClarificationAdditionalInfo: 'some extra info'
            };
            const specificContent = [ 'clarificationCourtFeedback.other.title' ];
            const specificValues = [ 'some extra info' ];
            return content(ShareCourtDocuments, session, { specificContent, specificValues });
          });
        });
      }
    );

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
            'clarification.title',
            'clarification.extraDocs',
            'clarification.needToProvide'
          ];
          const session = { case: {
            state: 'AwaitingClarification',
            data: { dnOutcomeCase: true }
          } };
          return content(ShareCourtDocuments, session, { specificContentToNotExist });
        });
      }
    );
  });

  it('shows error if does not answer question', () => {
    const session = { case: { data: {} } };
    return question.testErrors(ShareCourtDocuments, session);
  });

  it('redirects to CheckYourAnswers if answer is no', () => {
    const fields = { upload: 'no' };
    return question.redirectWithField(ShareCourtDocuments, fields, CheckYourAnswers);
  });

  it('redirects to Upload if answer is yes', () => {
    const fields = { upload: 'yes' };
    return question.redirectWithField(ShareCourtDocuments, fields, Upload);
  });

  it('loads fields from the session', () => {
    const session = { case: { data: {} } };
    const sessionData = { upload: 'yes' };
    return question.rendersValues(ShareCourtDocuments, sessionData, session);
  });
});
