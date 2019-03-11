const exampleStep = require('steps/petition-progress-bar/PetitionProgressBar.step');
const { custom, expect, middleware, sinon } = require('@hmcts/one-per-page-test-suite');
const httpStatus = require('http-status-codes');
const idam = require('services/idam');

const feesAndPaymentsService = require('services/feesAndPaymentsService');

describe('Google analytics', () => {
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

  it('should to be injected into the page', () => {
    const googleAnalyticsId = 'google-analytics-id';
    return custom(exampleStep)
      .withGlobal('googleAnalyticsId', googleAnalyticsId)
      .withSession({
        case: {
          state: 'awaitingdecreenisi',
          data: {}
        }
      })
      .get()
      .expect(httpStatus.OK)
      .text(pageContent => {
        const googleAnalyticsCodeExists = pageContent.includes(
          '<!-- Global site tag (gtag.js) - Google Analytics -->'
        );
        const googleAnalyticsIdExists = pageContent.includes(googleAnalyticsId);
        expect(googleAnalyticsCodeExists).to.eql(true);
        return expect(googleAnalyticsIdExists).to.eql(true);
      });
  });
});
