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
      const specificContent = [
        'title',
        'needToRespond',
        'needToProvide'
      ];
      return content(CourtFeedback, session, { specificContent });
    });

    it('feedback for jurisdictionDetails', () => {
      const session = { case: { data: { RefusalClarificationReason: ['jurisdictionDetails'] } } };
      const specificContent = [
        'feedback.jurisdictionDetails.title',
        'feedback.jurisdictionDetails.description'
      ];
      return content(CourtFeedback, session, { specificContent });
    });

    it('feedback for marriageCertTranslation', () => {
      const session = { case: { data: {
        RefusalClarificationReason: ['marriageCertTranslation']
      } } };
      const specificContent = [
        'feedback.marriageCertTranslation.title',
        'feedback.marriageCertTranslation.description',
        'feedback.marriageCertTranslation.method1',
        'feedback.marriageCertTranslation.method2'
      ];
      return content(CourtFeedback, session, { specificContent });
    });

    it('feedback for marriageCertificate', () => {
      const session = { case: { data: { RefusalClarificationReason: ['marriageCertificate'] } } };
      const specificContent = [
        'feedback.marriageCertificate.title',
        'feedback.marriageCertificate.description'
      ];
      return content(CourtFeedback, session, { specificContent });
    });

    it('feedback for previousProceedingDetails', () => {
      const session = { case: { data: {
        RefusalClarificationReason: ['previousProceedingDetails']
      } } };
      const specificContent = [
        'feedback.previousProceedingDetails.title',
        'feedback.previousProceedingDetails.description'
      ];
      return content(CourtFeedback, session, { specificContent });
    });

    it('feedback for caseDetailsStatement', () => {
      const session = { case: { data: { RefusalClarificationReason: ['caseDetailsStatement'] } } };
      const specificContent = [
        'feedback.caseDetailsStatement.title',
        'feedback.caseDetailsStatement.description'
      ];
      return content(CourtFeedback, session, { specificContent });
    });

    it('feedback for other', () => {
      const session = { case: { data: {
        RefusalClarificationReason: ['other'],
        RefusalClarificationAdditionalInfo: 'some extra info'
      } } };
      const specificContent = [ 'feedback.other.title' ];
      const specificValues = [ 'some extra info' ];
      return content(CourtFeedback, session, { specificContent, specificValues });
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