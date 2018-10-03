const modulePath = 'steps/exit/Exit.step';

const Exit = require(modulePath);
const idam = require('services/idam');
const { middleware, sinon, content } = require('@hmcts/one-per-page-test-suite');
const preserveSession = require('middleware/preserveSession');

const session = {
  case: {
    data: {
      court: {
        northWest: {
          openingHours: 'Telephone Enquiries from: 8.30am to 5pm',
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

  it('has idam.protect, idam.logout, preserveSession middleware', () => {
    return middleware.hasMiddleware(Exit, [ idam.protect(), idam.logout(), preserveSession ]);
  });

  describe('values', () => {
    it('displays divorce center details', () => {
      return content(
        Exit,
        session,
        {
          specificValues: [
            session.case.data.court.northWest.openingHours,
            session.case.data.court.northWest.phoneNumber,
            session.case.data.court.northWest.email
          ]
        }
      );
    });
  });
});
