const modulePath = 'steps/court-feedback/CourtFeedback.step';

const CourtFeedback = require(modulePath);
const { content, sinon, middleware, question } = require('@hmcts/one-per-page-test-suite');
const idam = require('services/idam');
const ShareCourtDocuments = require('steps/share-court-documents/ShareCourtDocuments.step');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  describe('content', () => {
    it('renders the base content', () => {
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
      return content(CourtFeedback, session, { ignoreContent });
    });

    describe('show refusal reasons content', () => {
      it('feedback for jurisdictionDetails', () => {
        const session = { case: { data: { refusalClarificationReason: ['jurisdictionDetails'] } } };
        const specificContent = [
          'clarificationCourtFeedback.jurisdictionDetails.title',
          'clarificationCourtFeedback.jurisdictionDetails.description'
        ];
        return content(CourtFeedback, session, { specificContent });
      });

      it('feedback for marriageCertTranslation', () => {
        const session = { case: { data: {
          refusalClarificationReason: ['marriageCertTranslation']
        } } };
        const specificContent = [
          'clarificationCourtFeedback.marriageCertTranslation.title',
          'clarificationCourtFeedback.marriageCertTranslation.description',
          'clarificationCourtFeedback.marriageCertTranslation.method1',
          'clarificationCourtFeedback.marriageCertTranslation.method2'
        ];
        return content(CourtFeedback, session, { specificContent });
      });

      it('feedback for marriageCertificate', () => {
        const session = { case: { data: { refusalClarificationReason: ['marriageCertificate'] } } };
        const specificContent = [
          'clarificationCourtFeedback.marriageCertificate.title',
          'clarificationCourtFeedback.marriageCertificate.description'
        ];
        return content(CourtFeedback, session, { specificContent });
      });

      it('feedback for previousProceedingDetails', () => {
        const session = { case: { data: {
          refusalClarificationReason: ['previousProceedingDetails']
        } } };
        const specificContent = [
          'clarificationCourtFeedback.previousProceedingDetails.title',
          'clarificationCourtFeedback.previousProceedingDetails.description'
        ];
        return content(CourtFeedback, session, { specificContent });
      });

      it('feedback for caseDetailsStatement', () => {
        const session = { case: { data: {
          refusalClarificationReason: ['caseDetailsStatement']
        } } };
        const specificContent = [
          'clarificationCourtFeedback.caseDetailsStatement.title',
          'clarificationCourtFeedback.caseDetailsStatement.description'
        ];
        return content(CourtFeedback, session, { specificContent });
      });

      it('feedback for other', () => {
        const session = { case: { data: {
          refusalClarificationReason: ['other'],
          refusalClarificationAdditionalInfo: 'some extra info'
        } } };
        const specificContent = [ 'clarificationCourtFeedback.other.title' ];
        const specificValues = [ 'some extra info' ];
        return content(CourtFeedback, session, { specificContent, specificValues });
      });
    });
  });

  it('shows error if response not answered', () => {
    const session = { case: { data: { } } };
    return question.testErrors(CourtFeedback, session);
  });

  it('redirects to the ShareCourtDocuments page', () => {
    const fields = { response: 'some details' };
    const session = { case: { data: { } } };
    return question.redirectWithField(CourtFeedback, fields, ShareCourtDocuments, session);
  });
});