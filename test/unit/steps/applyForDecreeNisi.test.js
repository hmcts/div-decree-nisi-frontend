const modulePath = 'steps/apply-for-decree-nisi/ApplyForDecreeNisi.step';

const ApplyForDecreeNisi = require(modulePath);
const ApplyForDecreeNisiContent = require('steps/apply-for-decree-nisi/ApplyForDecreeNisi.content');
const MiniPetition = require('steps/mini-petition/MiniPetition.step');
const ExitPage = require('steps/exit/Exit.step');
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
    return middleware.hasMiddleware(ApplyForDecreeNisi, [ idam.protect() ]);
  });

  it('renders the content', () => {
    const ignoreContent = [
      'webChatTitle',
      'chatDown',
      'chatWithAnAgent',
      'noAgentsAvailable',
      'allAgentsBusy',
      'chatClosed',
      'chatAlreadyOpen',
      'chatOpeningHours'
    ];
    return content(ApplyForDecreeNisi, session, { ignoreContent });
  });

  it('shows error if does not answer question', () => {
    return question.testErrors(ApplyForDecreeNisi, session);
  });

  it('redirects to Exit page if answer is no', () => {
    const fields = { applyForDecreeNisi: 'no' };
    return question.redirectWithField(ApplyForDecreeNisi, fields, ExitPage, session);
  });

  it('redirects to MiniPetition if answer is yes', () => {
    const fields = { applyForDecreeNisi: 'yes' };
    return question.redirectWithField(ApplyForDecreeNisi, fields, MiniPetition, session);
  });

  it('loads fields from the session', () => {
    const stepData = { applyForDecreeNisi: 'yes' };
    return question.rendersValues(ApplyForDecreeNisi, stepData, session);
  });

  it('returns correct answers', () => {
    const expectedContent = [
      ApplyForDecreeNisiContent.en.fields.applyForDecreeNisi.title,
      ApplyForDecreeNisiContent.en.fields.applyForDecreeNisi.yes
    ];
    const stepData = { applyForDecreeNisi: 'yes' };
    return question.answers(ApplyForDecreeNisi, stepData, expectedContent, session);
  });
});
