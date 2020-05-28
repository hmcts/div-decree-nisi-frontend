const modulePath = 'steps/lived-apart-since-desertion/LivedApartSinceDesertion.step';

const LivedApartSinceDesertionContent = require('steps/lived-apart-since-desertion/LivedApartSinceDesertion.content');  // eslint-disable-line
const LivedApartSinceDesertion = require(modulePath);
const ClaimCosts = require('steps/claim-costs/ClaimCosts.step');
const ShareCourtDocuments = require('steps/share-court-documents/ShareCourtDocuments.step');
const idam = require('services/idam');
const { middleware, question, sinon,
  content, expect } = require('@hmcts/one-per-page-test-suite');

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
    const ignoreContent = [
      'webChatTitle',
      'chatDown',
      'chatWithAnAgent',
      'noAgentsAvailable',
      'allAgentsBusy',
      'chatClosed',
      'chatAlreadyOpen',
      'chatOpeningHours',
      'clarificationCourtFeedback',
      'signIn',
      'languageToggle',
      'thereWasAProblem',
      'change'
    ];

    return content(LivedApartSinceDesertion, session, { ignoreContent });
  });

  it('shows error if does not answer question', () => {
    const onlyErrors = ['required'];
    return question.testErrors(LivedApartSinceDesertion, session, {}, { onlyErrors });
  });

  it('shows error if answered no and no data entered', () => {
    const onlyErrors = ['requireDatesOfLivingTogether'];
    const fields = { 'changes.livedApartSinceDesertion': 'no',
      'changes.approximateDatesOfLivingTogetherField': '' };
    return question.testErrors(LivedApartSinceDesertion, session, fields, { onlyErrors });
  });

  it('redirects to ClaimCosts if answer is no and details are provided', () => {
    const fields = { 'changes.livedApartSinceDesertion': 'no',
      'changes.approximateDatesOfLivingTogetherField': 'details...' };
    const sessionData = {
      case: {
        data: {
          claimsCosts: 'Yes'
        }
      }
    };
    return question.redirectWithField(LivedApartSinceDesertion, fields, ClaimCosts, sessionData);
  });

  it('redirects to ClaimCosts if answered yes', () => {
    const fields = {
      'changes.livedApartSinceDesertion': 'yes'
    };
    const sessionData = {
      case: {
        data: {
          claimsCosts: 'Yes'
        }
      }
    };
    return question.redirectWithField(LivedApartSinceDesertion, fields, ClaimCosts, sessionData);
  });


  it('redirects to ShareCourtDocuments if answered yes and claimsCosts is No', () => {
    const fields = {
      'changes.livedApartSinceDesertion': 'yes'
    };
    const sessionData = {
      case: {
        data: {
          claimsCosts: 'No'
        }
      }
    };
    return question.redirectWithField(
      LivedApartSinceDesertion,
      fields,
      ShareCourtDocuments,
      sessionData
    );
  });


  it('redirects to ShareCourtDocuments if answered yes and claimsCosts is No', () => {
    const fields = { 'changes.livedApartSinceDesertion': 'no',
      'changes.approximateDatesOfLivingTogetherField': 'details...' };
    const sessionData = {
      case: {
        data: {
          claimsCosts: 'No'
        }
      }
    };
    return question.redirectWithField(
      LivedApartSinceDesertion,
      fields,
      ShareCourtDocuments,
      sessionData
    );
  });

  it('returns correct answers if answered yes and claimsCosts is Yes', () => {
    const expectedContent = [
      // eslint-disable-next-line max-len
      LivedApartSinceDesertionContent.en.fields.changes.livedApartSinceDesertion.yes
    ];

    const stepData = {
      changes: {
        livedApartSinceDesertion: 'yes'
      }
    };

    return question.answers(LivedApartSinceDesertion, stepData, expectedContent, session);
  });

  it('returns correct answers if answered no and claimsCosts is Yes', () => {
    const expectedContent = [
      // eslint-disable-next-line max-len
      LivedApartSinceDesertionContent.en.fields.changes.livedApartSinceDesertion.no
    ];

    const stepData = {
      changes: {
        livedApartSinceDesertion: 'no'
      }
    };

    return question.answers(LivedApartSinceDesertion, stepData, expectedContent, session);
  });

  describe('Returns correct values()', () => {
    it('livedApartSinceDesertion : yes ', () => {
      const selectedValue = 'yes';
      const detailsGiven = 'We are living together after desertion';
      const fields = {
        changes: {
          livedApartSinceDesertion: selectedValue,
          approximateDatesOfLivingTogetherField: detailsGiven
        }
      };
      const req = {
        journey: {},
        session: { LivedApartSinceDesertion: fields }
      };

      const res = {};
      const step = new LivedApartSinceDesertion(req, res);
      step.retrieve().validate();

      const _values = step.values();
      expect(_values).to.be.an('object');
      expect(_values).to.have.property('changes.livedApartSinceDesertion', selectedValue);
      expect(_values).to.not.have.property('changes.approximateDatesOfLivingTogetherField');
    });

    it('livedApartSinceDesertion : no ', () => {
      const selectedValue = 'no';
      const detailsGiven = 'We are living together after desertion';
      const fields = {
        changes: {
          livedApartSinceDesertion: selectedValue,
          approximateDatesOfLivingTogetherField: detailsGiven
        }
      };
      const req = {
        journey: {},
        session: { LivedApartSinceDesertion: fields }
      };

      const res = {};
      const step = new LivedApartSinceDesertion(req, res);
      step.retrieve().validate();

      const _values = step.values();
      expect(_values).to.be.an('object');
      expect(_values).to.have.property('changes.livedApartSinceDesertion', selectedValue);
      expect(_values).to.have.property(
        'changes.approximateDatesOfLivingTogetherField', detailsGiven
      );
    });
  });
});
