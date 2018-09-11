const modulePath = 'steps/lived-apart-since-separation/LivedApartSinceSeparation.step';

const LivedApartSinceSeparation = require(modulePath);
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
    const session = {
      originalPetition: {
        connections: {}
      }
    };
    const onlyErrors = ['required'];
    return question.testErrors(LivedApartSinceSeparation, session, {}, { onlyErrors });
  });

  it('does not redirect to ClaimCosts if answer is no and no details provided ', () => {
    const fields = { 'changes-livedApartSinceSeparation': 'no' };
    return question.redirectWithField(LivedApartSinceSeparation, fields, LivedApartSinceSeparation);
  });

  it('redirects to ClaimCosts if answer is no and details are provided', () => {
    const fields = { 'changes-livedApartSinceSeparation': 'no',
      'changes-approximateDatesOfLivingTogetherField': 'details...' };
    return question.redirectWithField(LivedApartSinceSeparation, fields, ClaimCosts);
  });
  it('redirects to ClaimCosts if answered changes yes', () => {
    const fields = {
      'changes-livedApartSinceSeparation': 'yes'
    };
    return question.redirectWithField(LivedApartSinceSeparation, fields, ClaimCosts);
  });
});
