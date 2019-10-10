const modulePath = 'steps/check-your-answers/CheckYourAnswers.step';

const CheckYourAnswers = require(modulePath);
const Done = require('steps/done/Done.step');
const idam = require('services/idam');
const { middleware, question, sinon, content } = require('@hmcts/one-per-page-test-suite');
const caseOrchestrationService = require('services/caseOrchestrationService');
const config = require('config');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(CheckYourAnswers, [ idam.protect() ]);
  });

  describe('content for decree nisi application', () => {
    it('correct content', () => {
      const ignoreContent = [
        'applyingForDecreeNisi',
        'applyingForDecreeNisiClaimsCostsRespondent',
        'applyingForDecreeNisiClaimsCostsCoRespondent',
        'applyingForDecreeNisiClaimsCostsRespondentCoRespondent',
        'continue',
        'clarificationCourtFeedback',
        'needToProvide',
        'webChatTitle',
        'chatDown',
        'chatWithAnAgent',
        'noAgentsAvailable',
        'allAgentsBusy',
        'chatClosed',
        'chatAlreadyOpen',
        'chatOpeningHours'
      ];
      const session = { case: { data: {} } };
      return content(CheckYourAnswers, session, { ignoreContent });
    });

    it('does not display and clarification content', () => {
      const specificContentToNotExist = [
        'clarificationCourtFeedback',
        'needToProvide',
        'fields.statementOfTruth.clarification'
      ];
      const session = { case: { data: {} } };
      return content(CheckYourAnswers, session, { specificContentToNotExist });
    });
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
          'needToProvide',
          'fields.statementOfTruth.clarificationYes'
        ];

        return content(CheckYourAnswers, session, { specificContent });
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
          return content(CheckYourAnswers, session, { specificContent });
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
          return content(CheckYourAnswers, session, { specificContent });
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
          return content(CheckYourAnswers, session, { specificContent });
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
          return content(CheckYourAnswers, session, { specificContent });
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
          return content(CheckYourAnswers, session, { specificContent });
        });

        it('feedback for other', () => {
          session.case.data = {
            refusalClarificationReason: ['other'],
            refusalClarificationAdditionalInfo: 'some extra info',
            dnOutcomeCase: true
          };
          const specificContent = [ 'clarificationCourtFeedback.other.title' ];
          const specificValues = [ 'some extra info' ];
          return content(CheckYourAnswers, session, { specificContent, specificValues });
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
          'needToProvide',
          'fields.statementOfTruth.clarification'
        ];
        const session = { case: { state: 'AwaitingClarification', data: { dnOutcomeCase: true } } };
        return content(CheckYourAnswers, session, { specificContentToNotExist });
      });
    }
  );

  describe('errors', () => {
    beforeEach(() => {
      sinon.stub(caseOrchestrationService, 'submitApplication');
    });

    afterEach(() => {
      caseOrchestrationService.submitApplication.restore();
    });

    it('shows error if does not answer question', () => {
      const session = { case: { data: {} } };
      const onlyErrors = ['required'];
      return question.testErrors(CheckYourAnswers, session, {}, { onlyErrors });
    });

    it('shows error if case submission fails', () => {
      caseOrchestrationService.submitApplication.rejects();
      const fields = { statementOfTruth: 'yes' };
      const session = { case: { data: {} } };
      const onlyErrors = ['submitError'];
      return question.testErrors(CheckYourAnswers, session, fields, { onlyErrors });
    });
  });

  describe('navigates', () => {
    beforeEach(() => {
      sinon.stub(caseOrchestrationService, 'submitApplication');
    });

    afterEach(() => {
      caseOrchestrationService.submitApplication.restore();
    });

    it('to Done if statement of true answered', () => {
      caseOrchestrationService.submitApplication.resolves();
      const fields = { statementOfTruth: 'yes' };
      return question.redirectWithField(CheckYourAnswers, fields, Done);
    });

    it('to start page if save application fails', () => {
      caseOrchestrationService.submitApplication.rejects();
      const fields = { statementOfTruth: 'yes' };
      return question.redirectWithField(CheckYourAnswers, fields, CheckYourAnswers);
    });
  });

  describe('claims costs statement of truth', () => {
    it('from respondent and correspondent', () => {
      const session = {
        case: {
          data: {
            claimsCosts: 'Yes',
            claimsCostsFrom: ['respondent', 'correspondent']
          }
        },
        ClaimCosts: {
          dnCosts: {
            claimCosts: 'originalAmount'
          }
        }
      };
      const specificContent = ['applyingForDecreeNisiClaimsCostsRespondentCoRespondent'];
      return content(CheckYourAnswers, session, { specificContent });
    });

    it('from respondent', () => {
      const session = {
        case: {
          data: {
            claimsCosts: 'Yes',
            claimsCostsFrom: ['respondent']
          }
        },
        ClaimCosts: {
          dnCosts: {
            claimCosts: 'originalAmount'
          }
        }
      };
      const specificContent = ['applyingForDecreeNisiClaimsCostsRespondent'];
      return content(CheckYourAnswers, session, { specificContent });
    });

    it('from correspondent', () => {
      const session = {
        case: {
          data: {
            claimsCosts: 'Yes',
            claimsCostsFrom: ['correspondent']
          }
        },
        ClaimCosts: {
          dnCosts: {
            claimCosts: 'originalAmount'
          }
        }
      };
      const specificContent = ['applyingForDecreeNisiClaimsCostsCoRespondent'];
      return content(CheckYourAnswers, session, { specificContent });
    });

    it('dont claim anymore', () => {
      const session = {
        case: {
          data: {
            claimsCosts: 'Yes',
            claimsCostsFrom: ['correspondent']
          }
        },
        ClaimCosts: {
          dnCosts: {
            claimCosts: 'endClaim'
          }
        }
      };
      const specificContent = ['applyingForDecreeNisi'];
      return content(CheckYourAnswers, session, { specificContent });
    });

    it('no claim costs', () => {
      const session = { case: { data: {} } };
      const specificContent = ['applyingForDecreeNisi'];
      return content(CheckYourAnswers, session, { specificContent });
    });
  });
});
