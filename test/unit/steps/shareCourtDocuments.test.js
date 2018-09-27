const modulePath = 'steps/share-court-documents/ShareCourtDocuments.step';

const ShareCourtDocuments = require(modulePath);
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
    return middleware.hasMiddleware(ShareCourtDocuments, [ idam.protect() ]);
  });

  it('renders the content', () => {
    return content(ShareCourtDocuments);
  });

  it('shows error if does not answer question', () => {
    return question.testErrors(ShareCourtDocuments);
  });

  it('redirects to CheckYourAnswers if answer is no', () => {
    const fields = { upload: 'no' };
    return question.redirectWithField(ShareCourtDocuments, fields, CheckYourAnswers);
  });

  it('redirects to Upload if answer is yes', () => {
    const fields = { upload: 'yes' };
    return question.redirectWithField(ShareCourtDocuments, fields, Upload);
  });

  it('loads fields from the session', () => {
    const sessionData = { upload: 'yes' };
    return question.rendersValues(ShareCourtDocuments, sessionData);
  });
});
