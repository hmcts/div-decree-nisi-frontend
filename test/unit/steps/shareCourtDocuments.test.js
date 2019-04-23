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

  describe('Renders content', () => {
    it('renders the common content', () => {
      const session = { case: { data: {} } };
      const ignoreContent = ['adultery', 'otherReasons'];
      return content(ShareCourtDocuments, session, { ignoreContent });
    });

    it('renders the adultery related content', () => {
      const session = {
        case: {
          data: {
            reasonForDivorce: 'adultery',
            respAdmitOrConsentToFact: 'No'
          }
        }
      };
      const specificContent = [
        'adultery.title',
        'adultery.adulteryDoc',
        'adultery.extraDocs'
      ];
      return content(ShareCourtDocuments, session, { specificContent });
    });

    it('renders the other reasons for divorce related content', () => {
      const session = {
        case: {
          data: {
            reasonForDivorce: 'unreasonable-behaviour'
          }
        }
      };
      const specificContent = [
        'otherReasons.title',
        'otherReasons.extraDocuments'
      ];
      return content(ShareCourtDocuments, session, { specificContent });
    });
  });

  it('shows error if does not answer question', () => {
    const session = { case: { data: {} } };
    return question.testErrors(ShareCourtDocuments, session);
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
    const session = { case: { data: {} } };
    const sessionData = { upload: 'yes' };
    return question.rendersValues(ShareCourtDocuments, sessionData, session);
  });
});
