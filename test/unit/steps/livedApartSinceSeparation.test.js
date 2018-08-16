const modulePath = 'steps/lived-apart-since-separation/LivedApartSinceSeparation.step';

const LivedApartSinceSeparation = require(modulePath);
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
    return middleware.hasMiddleware(LivedApartSinceSeparation, [ idam.protect() ]);
  });

  it('renders the content', () => {
    return content(LivedApartSinceSeparation);
  });

  it('shows error if does not answer question', () => {
    return question.testErrors(LivedApartSinceSeparation);
  });

  it('redirects to End if answer is no', () => {
    const fields = { livedApartSinceSeparation: 'no' };
    return question.redirectWithField(LivedApartSinceSeparation, fields, End);
  });

  it('redirects to End if answer is yes', () => {
    const fields = { livedApartSinceSeparation: 'yes' };
    return question.redirectWithField(LivedApartSinceSeparation, fields, End);
  });

  it('loads fields from the session', () => {
    const sessionData = { livedApartSinceSeparation: 'yes' };
    return question.rendersValues(LivedApartSinceSeparation, sessionData);
  });
});
