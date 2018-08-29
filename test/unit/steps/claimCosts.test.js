const modulePath = 'steps/claim-costs/ClaimCosts.step';

const ClaimCosts = require(modulePath);
const Upload = require('steps/upload/Upload.step');
const idam = require('services/idam');
const { middleware, question, sinon, content } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(ClaimCosts, [ idam.protect() ]);
  });

  it('renders the content', () => {
    return content(ClaimCosts);
  });

  it('shows error if does not answer question', () => {
    return question.testErrors(ClaimCosts);
  });

  it('redirects to Upload if answer is originalAmount', () => {
    const fields = { claimCosts: 'originalAmount' };
    return question.redirectWithField(ClaimCosts, fields, Upload);
  });

  it('redirects to Upload if answer is suggestedAmount', () => {
    const fields = { claimCosts: 'suggestedAmount' };
    return question.redirectWithField(ClaimCosts, fields, Upload);
  });

  it('redirects to Upload if answer is dontClaimDifferentAmount', () => {
    const fields = { claimCosts: 'dontClaimDifferentAmount' };
    return question.redirectWithField(ClaimCosts, fields, Upload);
  });

  it('loads fields from the session', () => {
    const sessionData = { claimCosts: 'dontClaimDifferentAmount' };
    return question.rendersValues(ClaimCosts, sessionData);
  });
});
