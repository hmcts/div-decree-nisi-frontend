const modulePath = 'steps/behaviour-continued-since-application/BehaviourContinuedSinceApplication.step';

const BehaviourContinuedSinceApplication = require(modulePath);

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
    return middleware.hasMiddleware(BehaviourContinuedSinceApplication, [ idam.protect() ]);
  });

  it('renders the content', () => {
    return content(BehaviourContinuedSinceApplication);
  });


  it('shows error if does not answer question', () => {
    const onlyErrors = ['required'];
    return question.testErrors(BehaviourContinuedSinceApplication, {}, {}, { onlyErrors });
  });


  it('redirects to ClaimCosts if answered yes', () => {
    const fields = {
      'changes-behaviourContinuedSinceApplication': 'yes'
    };
    return question.redirectWithField(BehaviourContinuedSinceApplication, fields, ClaimCosts);
  });
});
