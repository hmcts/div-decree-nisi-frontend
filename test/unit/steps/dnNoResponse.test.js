const DnNoResponse = require('steps/dn-no-response/DnNoResponse.step');
const DnNoResponseContent = require('steps/dn-no-response/DnNoResponse.content');
const { custom, expect, sinon, content } = require('@hmcts/one-per-page-test-suite');
const httpStatus = require('http-status-codes');
const { getExpectedCourtsList, testDivorceUnitDetailsRender,
  testCTSCDetailsRender } = require('test/unit/helpers/courtInformation');

const feesAndPaymentsService = require('services/feesAndPaymentsService');

const { feeTypes } = require('middleware/feesAndPaymentsMiddleware');

describe('DnNoResponse step', () => {
  beforeEach(() => {
    sinon.stub(feesAndPaymentsService, 'getFee')
      .resolves({
        feeCode: 'FEE0002',
        version: 4,
        amount: 550.00,
        description: 'Filing an application for a divorce, nullity or civil partnership dissolution – fees order 1.2.' // eslint-disable-line max-len
      });
  });

  afterEach(() => {
    feesAndPaymentsService.getFee.restore();
  });


  it('renders the content', () => {
    const session = { case: { data: {} } };
    const specificContent = [
      'believeRespChoseNotToRespond.formD89',
      'applyD11',
      'doneWithAllWaysOfDelivering.applyD13bLink'
    ];
    return content(DnNoResponse, session, { specificContent });
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
      DnNoResponse,
      session,
      { specificContent: ['title'] }
    ).then(() => {
      sinon.assert.calledWith(feesAndPaymentsService.getFee, feeTypes.appWithoutNoticeFee);
      sinon.assert.calledWith(feesAndPaymentsService.getFee, feeTypes.enforcementFee);
    });
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

      return custom(DnNoResponse)
        .withSession(session)
        .get()
        .expect(httpStatus.OK)
        .html($ => {
          const rightHandSideMenu = $('.govuk-grid-column-one-third').html();

          testDivorceUnitDetailsRender(rightHandSideMenu);
          expect(rightHandSideMenu).to.include(DnNoResponseContent.en.openTimes)
            .and.to.include(DnNoResponseContent.en.divorceEmail)
            .and.to.include(DnNoResponseContent.en.phoneNumber);
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

      return custom(DnNoResponse)
        .withSession(session)
        .get()
        .expect(httpStatus.OK)
        .html($ => {
          const rightHandSideMenu = $('.govuk-grid-column-one-third').html();

          testCTSCDetailsRender(rightHandSideMenu);
          expect(rightHandSideMenu).to.include(DnNoResponseContent.en.openTimes)
            .and.to.include(DnNoResponseContent.en.divorceEmail)
            .and.to.include(DnNoResponseContent.en.phoneNumber);
        });
    });
  });
});
