const modulePath = 'steps/exit/Exit.step';

const Exit = require(modulePath);
const idam = require('services/idam');
const { middleware, sinon, content } = require('@hmcts/one-per-page-test-suite');

const session = {
  case: {
    data: {
      court: {
        northWest: {
          openingHours: 'Telephone Enquiries from: Monday to Friday, 8am to 8pm, Saturday 8am to 2pm', // eslint-disable-line
          phoneNumber: '0300 303 0642',
          email: 'family@liverpool.countycourt.gsi.gov.uk'
        }
      },
      courts: 'northWest'
    }
  }
};

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect and idam.logout middleware', () => {
    return middleware.hasMiddleware(Exit, [ idam.protect(), idam.logout() ]);
  });

  describe('values', () => {
    it('displays divorce center details', () => {
      const ignoreContent = [
        'webChatTitle',
        'chatDown',
        'chatWithAnAgent',
        'noAgentsAvailable',
        'allAgentsBusy',
        'chatClosed',
        'chatAlreadyOpen',
        'chatOpeningHours',
        'continue',
        'serviceName',
        'signOut',
        'email',
        'phone',
        'clarificationCourtFeedback',
        'backLink'
      ];

      return content(
        Exit,
        session,
        { ignoreContent }
      );
    });
  });
});
