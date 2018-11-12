const exampleStep = require('steps/petition-progress-bar/PetitionProgressBar.step');
const { custom, expect, middleware, sinon } = require('@hmcts/one-per-page-test-suite');
const httpStatus = require('http-status-codes');
const idam = require('services/idam');
const redirectMiddleware = require('middleware/redirectMiddleware');

describe('Google analytics', () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
    sinon.stub(redirectMiddleware, 'redirectOnCondition').callsFake(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
    redirectMiddleware.redirectOnCondition.restore();
  });

  it('should to be injected into the page', () => {
    const googleAnalyticsId = 'google-analytics-id';
    return custom(exampleStep)
      .withGlobal('googleAnalyticsId', googleAnalyticsId)
      .withSession({ case: { data: {} } })
      .get()
      .expect(httpStatus.OK)
      .text(pageContent => {
        const googleAnalyticsCodeExists = pageContent.includes('<!-- Google Analytics -->');
        const googleAnalyticsIdExists = pageContent.includes(googleAnalyticsId);
        expect(googleAnalyticsCodeExists).to.eql(true);
        return expect(googleAnalyticsIdExists).to.eql(true);
      });
  });
});
