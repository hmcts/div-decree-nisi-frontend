const modulePath = 'steps/review-aos-response/ReviewAosResponse.step';

const ReviewAosResponse = require(modulePath);
const ReviewAosResponseContent = require('steps/review-aos-response/ReviewAosResponse.content');
const ApplyForDecreeNisi = require('steps/apply-for-decree-nisi/ApplyForDecreeNisi.step');
const idam = require('services/idam');
const { middleware, sinon, content, question } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(ReviewAosResponse, [ idam.protect() ]);
  });

  it('redirects to next page', () => {
    const fields = { reviewAosResponse: 'yes' };
    const session = {
      case: {
        state: 'DNAwaiting',
        data: {}
      }
    };
    return question.redirectWithField(ReviewAosResponse, fields, ApplyForDecreeNisi, session);
  });

  it('CCD state : AosSubmittedAwaitingAnswer, renders the content to view response', () => {
    const session = {
      case: {
        state: 'AosSubmittedAwaitingAnswer',
        data: {}
      }
    };
    const ignoreContent = [
      'continue',
      'respondentDoesNotAgree',
      'payEqualAmounts',
      'payCosts',
      'suggestPayingDifferent'
    ];
    return content(ReviewAosResponse, session, { ignoreContent });
  });

  it('CCD state : DNAwaiting, renders the content to review response', () => {
    const session = {
      case: {
        state: 'DNAwaiting',
        data: {}
      }
    };
    const ignoreContent = [
      'willDefendDivorce',
      'agreedToPayCosts',
      'viewPayCosts',
      'viewSuggestPayingDifferent'
    ];
    return content(ReviewAosResponse, session, { ignoreContent });
  });

  it.skip('returns correct answers', () => {
    const expectedContent = [
      ReviewAosResponseContent.en.fields.reviewAosResponse.title,
      ReviewAosResponseContent.en.fields.reviewAosResponse.yes
    ];
    const session = { reviewAosResponse: 'yes' };
    return question.answers(ReviewAosResponse, session, expectedContent);
  });

  describe('values', () => {
    it('displays petitioner and respondent names', () => {
      const session = {
        case: {
          data: {
            connections: {},
            petitionerFirstName: 'petitioner',
            petitionerLastName: 'name',
            respondentFirstName: 'respondent',
            respondentLastName: 'name'
          }
        }
      };
      return content(
        ReviewAosResponse,
        session,
        {
          specificValues: [
            session.case.data.petitionerFirstName,
            session.case.data.petitionerLastName,
            session.case.data.respondentFirstName,
            session.case.data.respondentLastName
          ]
        }
      );
    });
  });
});
