const modulePath = 'steps/lived-apart-since-separation/LivedApartSinceSeparation.step';

const LivedApartSinceSeparation = require(modulePath);
const LivedApartSinceSeparationContent = require(
  'steps/lived-apart-since-separation/LivedApartSinceSeparation.content'
);
const ClaimCosts = require('steps/claim-costs/ClaimCosts.step');
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
    return middleware.hasMiddleware(LivedApartSinceSeparation, [ idam.protect() ]);
  });

  it('renders the content', () => {
    return content(LivedApartSinceSeparation);
  });

  it('shows error if does not answer question', () => {
    return question.testErrors(LivedApartSinceSeparation);
  });

  it('redirects to ClaimCosts if answer is no', () => {
    const fields = { livedApartSinceSeparation: 'no' };
    return question.redirectWithField(LivedApartSinceSeparation, fields, ClaimCosts);
  });

  it('redirects to ClaimCosts if answer is yes', () => {
    const fields = { livedApartSinceSeparation: 'yes' };
    return question.redirectWithField(LivedApartSinceSeparation, fields, ClaimCosts);
  });

  it('loads fields from the session', () => {
    const sessionData = { livedApartSinceSeparation: 'yes' };
    return question.rendersValues(LivedApartSinceSeparation, sessionData);
  });

  it('returns correct answers', () => {
    const expectedContent = [
      LivedApartSinceSeparationContent.en.fields.livedApartSinceSeparation.title,
      LivedApartSinceSeparationContent.en.fields.livedApartSinceSeparation.yes
    ];
    const session = { livedApartSinceSeparation: 'yes' };
    return question.answers(LivedApartSinceSeparation, session, expectedContent);
  });
});
