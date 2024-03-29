const modulePath = 'steps/resp-not-admit-adultery/RespNotAdmitAdultery.step';

const RespNotAdmitAdultery = require(modulePath);
const RespNotAdmitAdulteryContent = require(
  'steps/resp-not-admit-adultery/RespNotAdmitAdultery.content'
);
const AmendApplication = require('steps/amend-application/AmendApplication.step');
const idam = require('services/idam');
const { middleware, sinon, content, question } = require('@hmcts/one-per-page-test-suite');

const feesAndPaymentsService = require('services/feesAndPaymentsService');
const { feeTypes } = require('middleware/feesAndPaymentsMiddleware');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);

    sinon.stub(feesAndPaymentsService, 'getFee')
      .resolves({
        feeCode: 'FEE0002',
        version: 4,
        amount: 550.00,
        description: 'Filing an application for a divorce, nullity or civil partnership dissolution – fees order 1.2.' // eslint-disable-line max-len
      });
  });

  afterEach(() => {
    idam.protect.restore();
    feesAndPaymentsService.getFee.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(RespNotAdmitAdultery, [ idam.protect() ]);
  });


  it('getFeeFromFeesAndPayments middleware call', () => { // eslint-disable-line max-len
    const session = {
      case: {
        data: {
          connections: {}
        }
      }
    };
    return content(
      RespNotAdmitAdultery,
      session,
      { specificContent: ['title'] }
    ).then(() => {
      sinon.assert.calledWith(feesAndPaymentsService.getFee, feeTypes.amendFee);
    });
  });

  describe('Respondent not admitted to Adultery', () => {
    it('renders the content', () => {
      const ignoreContent = [
        'webChatTitle',
        'chatDown',
        'chatWithAnAgent',
        'noAgentsAvailable',
        'allAgentsBusy',
        'chatClosed',
        'chatAlreadyOpen',
        'chatOpeningHours',
        'clarificationCourtFeedback',
        'signIn',
        'languageToggle',
        'thereWasAProblem',
        'change',
        'husband',
        'wife',
        'phoneToCallIfProblems'
      ];

      const session = {
        case: {
          state: 'DNAwaiting',
          data: {
            reasonForDivorce: 'adultery',
            respAdmitOrConsentToFact: 'Yes'
          }
        }
      };

      return content(RespNotAdmitAdultery, session, { ignoreContent });
    });

    it('returns correct answers', () => {
      const expectedContent = [ RespNotAdmitAdulteryContent.en.fields.amendPetition.no ];
      const session = {
        case: {
          data: {
            reasonForDivorce: 'adultery',
            respAdmitOrConsentToFact: 'No'
          }
        }
      };
      const fields = { amendPetition: 'no' };
      return question.answers(RespNotAdmitAdultery, fields, expectedContent, session);
    });

    it('redirects to AmendPetition page', () => {
      const fields = { amendPetition: 'yes' };
      return question.redirectWithField(RespNotAdmitAdultery, fields, AmendApplication);
    });
  });
});
