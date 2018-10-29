const modulePath = 'steps/done/Done.step';

const Done = require(modulePath);
const DoneContent = require('steps/done/Done.content');
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
    const session = { case: { data: {} } };
    return content(Done, session, { ignoreContent: ['continue'] });
  });

  describe('values', () => {
    it('displays reference number', () => {
      const referenceNumber = '1234‐5678‐9012‐4567';
      const session = {
        case: {
          caseId: referenceNumber.replace(/‐/g, ''),
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
            courts: 'expectedCourt',
            court: {
              eastMidlands: {
                divorceCentre: 'East Midlands Regional Divorce Centre',
                courtCity: 'Nottingham',
                poBox: 'PO Box 10447',
                postCode: 'NG2 9QN',
                openingHours: 'Telephone Enquiries from: 8.30am to 5pm',
                email: 'eastmidlandsdivorce@hmcts.gsi.gov.uk',
                phoneNumber: '0300 303 0642'
              },
              expectedCourt: {
                divorceCentre: 'Expected court center',
                courtCity: 'City',
                poBox: 'PO Box',
                postCode: 'PostCode',
                openingHours: 'Opening hours info',
                email: 'Email info',
                phoneNumber: 'phone number info'
              }
            }
          }
        }
      };

      return content(
        Done,
        session,
        {
          specificValues: [
            session.case.data.court.expectedCourt.divorceCentre,
            session.case.data.court.expectedCourt.courtCity,
            session.case.data.court.expectedCourt.poBox,
            session.case.data.court.expectedCourt.postCode,
            DoneContent.openTimes,
            DoneContent.divorceEmail,
            DoneContent.phoneNumber
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
          specificValues: [ session.case.data.petitionerEmail ]
        }
      );
    });
  });
});
