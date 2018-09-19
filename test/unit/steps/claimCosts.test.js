const modulePath = 'steps/claim-costs/ClaimCosts.step';

const ClaimCosts = require(modulePath);
const ClaimCostsContent = require('steps/claim-costs/ClaimCosts.content');
const ShareCourtDocuments = require('steps/share-court-documents/ShareCourtDocuments.step');
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

  it('redirects to ShareCourtDocuments if answer is originalAmount', () => {
    const fields = { claimCosts: 'originalAmount' };
    return question.redirectWithField(ClaimCosts, fields, ShareCourtDocuments);
  });

  it('redirects to ShareCourtDocuments if answer is suggestedAmount', () => {
    const fields = { claimCosts: 'suggestedAmount' };
    return question.redirectWithField(ClaimCosts, fields, ShareCourtDocuments);
  });

  it('redirects to ShareCourtDocuments if answer is dontClaimDifferentAmount', () => {
    const fields = { claimCosts: 'dontClaimDifferentAmount' };
    return question.redirectWithField(ClaimCosts, fields, ShareCourtDocuments);
  });

  it('loads fields from the session', () => {
    const sessionData = { claimCosts: 'dontClaimDifferentAmount' };
    return question.rendersValues(ClaimCosts, sessionData);
  });

  it('returns correct answers', () => {
    const expectedContent = [
      ClaimCostsContent.en.fields.claimCosts.title,
      ClaimCostsContent.en.fields.claimCosts.originalAmount
    ];
    const session = { claimCosts: 'originalAmount' };
    return question.answers(ClaimCosts, session, expectedContent);
  });
});
