const modulePath = 'steps/done/Done.step';

const Done = require(modulePath);
const idam = require('services/idam');
const { middleware, sinon, content } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect & idam.logout', () => {
    return middleware.hasMiddleware(Done, [ idam.protect(), idam.logout() ]);
  });

  it('renders the content', () => {
    const session = { case: { data: {} } };
    return content(Done, session, { ignoreContent: ['continue'] });
  });

  describe('values', () => {
    it('displays reference number', () => {
      const referenceNumber = '1234 ‐ 5678 ‐ 9012 ‐ 4567';
      const session = {
        case: {
          caseId: referenceNumber.replace(/ ‐ /g, ''),
          data: {}
        }
      };
      return content(
        Done,
        session,
        {
          specificValues: [ referenceNumber ]
        }
      );
    });

    it('displays divorce center details', () => {
      const session = {
        case: {
          data: {
            divorceCenterName: 'divorce center name',
            divorceCenterEmail: 'thisistheemail@email.com',
            divorceCenterPhone: '0123456789'
          }
        }
      };
      return content(
        Done,
        session,
        {
          specificValues: [
            session.case.divorceCenterName,
            session.case.divorceCenterEmail,
            session.case.divorceCenterPhone
          ]
        }
      );
    });

    it('displays petitioner email', () => {
      const session = { case: { data: { petitionerEmail: 'petitioner@email.com' } } };
      return content(
        Done,
        session,
        {
          specificValues: [ session.case.petitionerEmail ]
        }
      );
    });
  });
});
