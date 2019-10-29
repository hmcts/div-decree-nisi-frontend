const modulePath = 'steps/share-court-documents-how/ShareCourtDocumentsHow.step';

const ShareCourtDocumentsHow = require(modulePath);
const CheckYourAnswers = require('steps/check-your-answers/CheckYourAnswers.step');
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
    return middleware.hasMiddleware(ShareCourtDocumentsHow, [ idam.protect() ]);
  });

  it('renders the common content', () => {
    const session = { case: { data: {} } };
    const ignoreContent = [
      'webChatTitle',
      'chatDown',
      'chatWithAnAgent',
      'noAgentsAvailable',
      'allAgentsBusy',
      'chatClosed',
      'chatAlreadyOpen',
      'chatOpeningHours',
      'clarificationCourtFeedback'
    ];
    return content(ShareCourtDocumentsHow, session, { ignoreContent });
  });

  it('shows error if does not answer question', () => {
    const session = { case: { data: {} } };
    return question.testErrors(ShareCourtDocumentsHow, session);
  });

  it('redirects to CheckYourAnswers if answer is no', () => {
    const fields = { clarificationDigital: 'no' };
    return question.redirectWithField(ShareCourtDocumentsHow, fields, CheckYourAnswers);
  });

  it('redirects to Upload if answer is yes', () => {
    const fields = { clarificationDigital: 'yes' };
    return question.redirectWithField(ShareCourtDocumentsHow, fields, Upload);
  });

  it('loads fields from the session', () => {
    const session = { case: { data: {} } };
    const sessionData = { clarificationDigital: 'yes' };
    return question.rendersValues(ShareCourtDocumentsHow, sessionData, session);
  });
});
