const modulePath = 'steps/lived-apart-since-desertion/LivedApartSinceDesertion.step';

const LivedApartSinceDesertionContent = require('steps/lived-apart-since-desertion/LivedApartSinceDesertion.content');  // eslint-disable-line
const LivedApartSinceDesertion = require(modulePath);
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
    return middleware.hasMiddleware(LivedApartSinceDesertion, [ idam.protect() ]);
  });

  it('renders the content', () => {
    return content(LivedApartSinceDesertion, session);
  });


  it('shows error if does not answer question', () => {
    const onlyErrors = ['required'];
    return question.testErrors(LivedApartSinceDesertion, session, {}, { onlyErrors });
  });

  it('shows error if answered no and no data entered', () => {
    const onlyErrors = ['requireDatesOfLivingTogether'];
    const fields = { 'changes-livedApartSinceDesertion': 'no',
      'changes-approximateDatesOfLivingTogetherField': '' };
    return question.testErrors(LivedApartSinceDesertion, session, fields, { onlyErrors });
  });

  it('redirects to ClaimCosts if answer is no and details are provided', () => {
    const fields = { 'changes-livedApartSinceDesertion': 'no',
      'changes-approximateDatesOfLivingTogetherField': 'details...' };
    return question.redirectWithField(LivedApartSinceDesertion, fields, ClaimCosts, session);
  });

  it('redirects to ClaimCosts if answered yes', () => {
    const fields = {
      'changes-livedApartSinceDesertion': 'yes'
    };
    return question.redirectWithField(LivedApartSinceDesertion, fields, ClaimCosts, session);
  });

  it('returns correct answers if answered yes', () => {
    const expectedContent = [
      // eslint-disable-next-line max-len
      LivedApartSinceDesertionContent.en.fields.changes.livedApartSinceDesertion.title,
      LivedApartSinceDesertionContent.en.fields.changes.livedApartSinceDesertion.yes
    ];

    const stepData = {
      changes: {
        livedApartSinceDesertion: 'yes'
      }
    };

    return question.answers(LivedApartSinceDesertion, stepData, expectedContent, session);
  });

  it('returns correct answers if answered no', () => {
    const expectedContent = [
      // eslint-disable-next-line max-len
      LivedApartSinceDesertionContent.en.fields.changes.livedApartSinceDesertion.title,
      LivedApartSinceDesertionContent.en.fields.changes.livedApartSinceDesertion.no
    ];

    const stepData = {
      changes: {
        livedApartSinceDesertion: 'no'
      }
    };

    return question.answers(LivedApartSinceDesertion, stepData, expectedContent, session);
  });
});
