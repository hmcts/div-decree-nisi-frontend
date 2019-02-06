const modulePath = 'steps/amend-application/AmendApplication.step';

const AmendApplication = require(modulePath);
const idam = require('services/idam');
const { middleware, sinon, content } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(AmendApplication, [idam.protect()]);
  });

  it('renders the content', () => {
    const ignoreContent = ['continue'];
    const session = { case: { data: {} } };
    const specificContent = [
      'start',
      'amendmentFee',
      'ifYouWantYour',
      'notAbleToRead'
    ];
    return content(AmendApplication, session, { specificContent, ignoreContent });
  });
});
