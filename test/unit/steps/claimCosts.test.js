const modulePath = 'steps/claim-costs/ClaimCosts.step';

const ClaimCosts = require(modulePath);
const ClaimCostsContent = require('steps/claim-costs/ClaimCosts.content');
const ShareCourtDocuments = require('steps/share-court-documents/ShareCourtDocuments.step');
const idam = require('services/idam');
const { middleware, question, sinon, content } = require('@hmcts/one-per-page-test-suite');

const session = { case: { data: {} } };

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
    return content(ClaimCosts, session);
  });

  it('shows error if does not answer question', () => {
    return question.testErrors(ClaimCosts, session);
  });

  it('redirects to ShareCourtDocuments if answer is originalAmount', () => {
    const fields = { claimCosts: 'originalAmount' };
    return question.redirectWithField(ClaimCosts, fields, ShareCourtDocuments, session);
  });

  it('redirects to ShareCourtDocuments if answer is suggestedAmount', () => {
    const fields = { claimCosts: 'suggestedAmount' };
    return question.redirectWithField(ClaimCosts, fields, ShareCourtDocuments, session);
  });

  it('redirects to ShareCourtDocuments if answer is dontClaimDifferentAmount', () => {
    const fields = { claimCosts: 'dontClaimDifferentAmount' };
    return question.redirectWithField(ClaimCosts, fields, ShareCourtDocuments, session);
  });

  it('loads fields from the session', () => {
    const stepData = { claimCosts: 'dontClaimDifferentAmount' };
    return question.rendersValues(ClaimCosts, stepData, session);
  });

  it('returns correct answers', () => {
    const expectedContent = [
      ClaimCostsContent.en.fields.claimCosts.title,
      ClaimCostsContent.en.fields.claimCosts.originalAmount
    ];
    const stepData = { claimCosts: 'originalAmount' };
    return question.answers(ClaimCosts, stepData, expectedContent, session);
  });
});
