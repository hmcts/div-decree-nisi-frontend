const modulePath = 'steps/review-aos-response/ReviewAosResponse.step';

const ReviewAosResponse = require(modulePath);
const ReviewAosResponseContent = require('steps/review-aos-response/ReviewAosResponse.content');
const RespNotAdmitAdultery = require('steps/resp-not-admit-adultery/RespNotAdmitAdultery.step');

const commonContent = require('common/content');
const ApplyForDecreeNisi = require('steps/apply-for-decree-nisi/ApplyForDecreeNisi.step');
// eslint-disable-next-line max-len
const idam = require('services/idam');
const {
  middleware, sinon, content,
  stepAsInstance, question, expect
} = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(ReviewAosResponse, [idam.protect()]);
  });

  describe('CCD state: AosSubmittedAwaitingAnswer', () => {
    it('renders the correct template', () => {
      const session = {
        case: {
          state: 'AosSubmittedAwaitingAnswer',
          data: {
            respWillDefendDivorce: 'Yes'
          }
        }
      };
      const instance = stepAsInstance(ReviewAosResponse, session);
      expect(instance.responseTemplate).to.eql(instance.consts.viewTemplate);
    });

    it('Continue button should not be rendered', () => {
      const session = {
        case: {
          state: 'AosSubmittedAwaitingAnswer',
          data: {
            respWillDefendDivorce: 'Yes'
          }
        }
      };
      const specificContentToNotExist = [commonContent.en.continue];
      return content(ReviewAosResponse, session, { specificContentToNotExist });
    });
  });

  describe('CCD state: DNAwaiting', () => {
    it('renders the correct template', () => {
      const session = {
        case: {
          state: 'AwaitingDecreeNisi',
          data: {
            respWillDefendDivorce: 'Yes'
          }
        }
      };
      const instance = stepAsInstance(ReviewAosResponse, session);
      expect(instance.responseTemplate).to.eql(instance.consts.reviewTemplate);
    });

    it('Continue button should be rendered', () => {
      const session = {
        case: {
          state: 'AwaitingDecreeNisi',
          data: {
            respWillDefendDivorce: 'Yes'
          }
        }
      };
      const specificContent = ['continue'];
      return content(ReviewAosResponse, session, { specificContent });
    });

    it('returns correct answers', () => {
      const expectedContent = [ReviewAosResponseContent.en.fields.reviewAosResponse.yes];
      const session = {
        case: {
          data: {
            respWillDefendDivorce: 'Yes'
          }
        }
      };
      return question.answers(ReviewAosResponse, {}, expectedContent, session);
    });

    it('redirects to ApplyForDecreeNisi page', () => {
      const fields = { reviewAosResponse: 'yes' };
      const session = {
        case: {
          data: {
            reasonForDivorce: 'unreasonable-behaviour'
          }
        }
      };
      return question.redirectWithField(ReviewAosResponse, fields, ApplyForDecreeNisi, session);
    });

    it('redirects to RespNotAdmitAdultery page - state: AosCompleted', () => {
      const fields = { reviewAosResponse: 'yes' };
      const session = {
        case: {
          state: 'AosCompleted',
          data: {
            reasonForDivorce: 'adultery',
            respAdmitOrConsentToFact: 'No'
          }
        }
      };
      return question.redirectWithField(ReviewAosResponse, fields, RespNotAdmitAdultery, session);
    });

    it('redirects to ApplyForDecreeNisi page - state is not matching with AOS completed', () => {
      const fields = { reviewAosResponse: 'yes' };
      const session = {
        case: {
          data: {
            reasonForDivorce: 'adultery',
            respAdmitOrConsentToFact: 'No'
          }
        }
      };
      return question.redirectWithField(ReviewAosResponse, fields, ApplyForDecreeNisi, session);
    });
  });
});
