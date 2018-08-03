const modulePath = 'steps/apply-for-decree-nisi/ApplyForDecreeNisi.step';

const ApplyForDecreeNisi = require(modulePath);
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
    return middleware.hasMiddleware(ApplyForDecreeNisi, [ idam.protect() ]);
  });

  it('renders the content', () => {
    return content(ApplyForDecreeNisi);
  });

  it('shows error if does not answer question', () => {
    return question.testErrors(ApplyForDecreeNisi);
  });

  it('redirects to End if answer is no', () => {
    const fields = { applyForDecreeNisi: 'no' };
    return question.redirectWithField(ApplyForDecreeNisi, fields, End);
  });

  it('redirects to End if answer is yes', () => {
    const fields = { applyForDecreeNisi: 'yes' };
    return question.redirectWithField(ApplyForDecreeNisi, fields, End);
  });

  it('loads fields from the session', () => {
    const sessionData = { applyForDecreeNisi: 'yes' };
    return question.rendersValues(ApplyForDecreeNisi, sessionData);
  });
});
