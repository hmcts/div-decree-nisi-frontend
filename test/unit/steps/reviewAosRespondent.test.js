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
    return question.redirectWithField(ReviewAosResponse, fields, ApplyForDecreeNisi);
  });

  it('renders the content', () => {
    const session = {
      case: {
        state: 'AosSubmittedAwaitingAnswer',
        data: {}
      }
    };

    return content(ReviewAosResponse, session);
  });

  it('renders the content', () => {
    const session = {
      case: {
        state: 'DNAwaiting',
        data: {}
      }
    };
    return content(ReviewAosResponse, session);
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
