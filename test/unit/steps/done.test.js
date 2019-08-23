const modulePath = 'steps/done/Done.step';

const Done = require(modulePath);
const DoneContent = require('steps/done/Done.content');
const idam = require('services/idam');
const { custom, expect, middleware, sinon, content } = require('@hmcts/one-per-page-test-suite');
const httpStatus = require('http-status-codes');
const { getExpectedCourtsList, testDivorceUnitDetailsRender,
  testCTSCDetailsRender } = require('test/unit/helpers/courtInformation');

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

  it('renders the content', () => {
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
      'continue',
      'careOf'
    ];
    return content(Done, session, { ignoreContent });
  });

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