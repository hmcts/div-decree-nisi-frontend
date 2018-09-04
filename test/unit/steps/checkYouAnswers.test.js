const modulePath = 'steps/check-your-answers/CheckYourAnswers.step';

const CheckYourAnswers = require(modulePath);
const End = require('steps/end/End.step');
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
    return middleware.hasMiddleware(CheckYourAnswers, [ idam.protect() ]);
  });

  it('renders the content', () => {
    return content(CheckYourAnswers, {}, { ignoreContent: ['continue'] });
  });

  it('shows error if does not answer question', () => {
    return question.testErrors(CheckYourAnswers);
  });

  it('redirects to End if statment of true answered', () => {
    const fields = { statementOfTruth: 'yes' };
    return question.redirectWithField(CheckYourAnswers, fields, End);
  });
});
