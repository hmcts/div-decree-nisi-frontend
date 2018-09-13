const modulePath = 'steps/done/Done.step';

const Done = require(modulePath);
const idam = require('services/idam');
const { middleware, sinon, content } = require('@hmcts/one-per-page-test-suite');
const preserveSession = require('middleware/preserveSession');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect, idam.logout, preserveSession middleware', () => {
    return middleware.hasMiddleware(Done, [ idam.protect(), idam.logout(), preserveSession ]);
  });

  it('renders the content', () => {
    return content(Done, {}, { ignoreContent: ['continue'] });
  });

  describe('values', () => {
    it('displays reference number', () => {
      const referenceNumber = '1234 ‐ 5678 ‐ 9012 ‐ 5672';
      const session = { referenceNumber: referenceNumber.replace(/ ‐ /g, '') };
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
        divorceCenterName: 'divorce center name',
        divorceCenterEmail: 'thisistheemail@email.com',
        divorceCenterPhone: '0123456789'
      };
      return content(
        Done,
        session,
        {
          specificValues: [
            session.divorceCenterName,
            session.divorceCenterEmail,
            session.divorceCenterPhone
          ]
        }
      );
    });

    it('displays petitioner email', () => {
      const session = { originalPetition: { petitionerEmail: 'petitioner@email.com' } };
      return content(
        Done,
        session,
        {
          specificValues: [ session.originalPetition.petitionerEmail ]
        }
      );
    });
  });
});
