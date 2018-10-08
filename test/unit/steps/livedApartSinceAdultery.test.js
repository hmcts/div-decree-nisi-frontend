const modulePath = 'steps/lived-apart-since-adultery/LivedApartSinceAdultery.step';

const LivedApartSinceAdultery = require(modulePath);
const LivedApartSinceAdulteryContent = require(
  'steps/lived-apart-since-adultery/LivedApartSinceAdultery.content'
);
const ClaimCosts = require('steps/claim-costs/ClaimCosts.step');
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
    return middleware.hasMiddleware(LivedApartSinceAdultery, [ idam.protect() ]);
  });

  it('renders the content', () => {
    return content(LivedApartSinceAdultery, session);
  });

  describe('errors', () => {
    it('shows error if does not answer question', () => {
      const onlyErrors = ['required'];
      return question.testErrors(LivedApartSinceAdultery, session, {}, { onlyErrors });
    });

    it('shows error if user answers no and does not enter date', () => {
      const onlyErrors = ['requireDatesLivedTogether'];
      const fields = { 'livedApart-livedApartSinceAdultery': 'no' };
      return question.testErrors(LivedApartSinceAdultery, session, fields, { onlyErrors });
    });
  });

  it('redirects to ClaimCosts if answer is yes', () => {
    const fields = { 'livedApart-livedApartSinceAdultery': 'yes' };
    return question.redirectWithField(LivedApartSinceAdultery, fields, ClaimCosts, session);
  });

  it('redirects to ClaimCosts if answer is no and dates givent', () => {
    const fields = {
      'livedApart-livedApartSinceAdultery': 'no',
      'livedApart-datesLivedTogether': '3 months'
    };
    return question.redirectWithField(LivedApartSinceAdultery, fields, ClaimCosts, session);
  });

  it('returns correct answers', () => {
    const expectedContent = [
      LivedApartSinceAdulteryContent.en.fields.livedApart.livedApartSinceAdultery.title,
      LivedApartSinceAdulteryContent.en.fields.livedApart.datesLivedTogether.title
    ];
    const stepData = {
      livedApart: {
        livedApartSinceAdultery: 'no',
        datesLivedTogether: '3 months'
      }
    };
    return question.answers(LivedApartSinceAdultery, stepData, expectedContent, session);
  });
});
