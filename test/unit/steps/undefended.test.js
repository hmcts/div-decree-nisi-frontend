const modulePath = 'steps/undefended/Undefended.step';

const Undefended = require(modulePath);
const End = require('steps/end/End.step.js');
const idam = require('services/idam');
const { middleware, interstitial, sinon, content } = require('@hmcts/one-per-page-test-suite');
const { getUserData } = require('middleware/ccd');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'authenticate').returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.authenticate.restore();
  });

  it('has idam.authenticate middleware', () => {
    return middleware.hasMiddleware(Undefended, [ idam.authenticate(), getUserData ]);
  });

  it('redirects to next page', () => {
    return interstitial.navigatesToNext(Undefended, End);
  });

  it('renders the content', () => {
    return content(Undefended);
  });
});
