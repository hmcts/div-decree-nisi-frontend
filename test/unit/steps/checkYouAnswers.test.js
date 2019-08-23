const modulePath = 'steps/check-your-answers/CheckYourAnswers.step';

const CheckYourAnswers = require(modulePath);
const Done = require('steps/done/Done.step');
const idam = require('services/idam');
const { middleware, question, sinon, content } = require('@hmcts/one-per-page-test-suite');
const caseOrchestrationService = require('services/caseOrchestrationService');

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

  it('renders the content', () => {
    const ignoreContent = [
      'applyingForDecreeNisi',
      'applyingForDecreeNisiClaimsCostsRespondent',
      'applyingForDecreeNisiClaimsCostsCoRespondent',
      'applyingForDecreeNisiClaimsCostsRespondentCoRespondent',
      'continue',
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
