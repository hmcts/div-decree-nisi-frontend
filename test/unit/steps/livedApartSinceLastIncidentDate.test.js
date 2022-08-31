const modulePath = 'steps/lived-apart-since-last-incident-date/LivedApartSinceLastIncidentDate.step'; // eslint-disable-line

const LivedApartSinceLastIncidentDateContent = require('steps/lived-apart-since-last-incident-date/LivedApartSinceLastIncidentDate.content'); // eslint-disable-line
const LivedApartSinceLastIncidentDate = require(modulePath);
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
    return middleware.hasMiddleware(LivedApartSinceLastIncidentDate, [ idam.protect() ]);
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
      'change',
      'husband',
      'wife',
      'phoneToCallIfProblems'
    ];

    return content(LivedApartSinceLastIncidentDate, session, { ignoreContent });
  });


  it('shows error if does not answer question', () => {
    const onlyErrors = ['required'];
    return question.testErrors(LivedApartSinceLastIncidentDate, session, {}, { onlyErrors });
  });

  it('shows error if answered no and no data entered', () => {
    const onlyErrors = ['requireDatesOfLivingTogether'];
    const fields = { 'changes.livedApartSinceLastIncidentDate': 'no',
      'changes.approximateDatesOfLivingTogetherField': '' };
    return question.testErrors(LivedApartSinceLastIncidentDate, session, fields, { onlyErrors });
  });

  it('redirects to ClaimCosts if answered no, details, claimsCosts is Yes', () => {
    const fields = { 'changes.livedApartSinceLastIncidentDate': 'no',
      'changes.approximateDatesOfLivingTogetherField': 'details...' };
    const sessionData = {
      case: {
        data: {
          claimsCosts: 'Yes'
        }
      }
    };
    return question.redirectWithField(
      LivedApartSinceLastIncidentDate,
      fields,
      ClaimCosts,
      sessionData
    );
  });

  it('redirects to ClaimCosts if answered yes and claimsCosts is Yes', () => {
    const fields = {
      'changes.livedApartSinceLastIncidentDate': 'yes'
    };
    const sessionData = {
      case: {
        data: {
          claimsCosts: 'Yes'
        }
      }
    };
    return question.redirectWithField(
      LivedApartSinceLastIncidentDate,
      fields,
      ClaimCosts,
      sessionData
    );
  });


  it('redirects to ShareCourtDocuments if answered no, details, claimsCosts is No', () => {
    const fields = { 'changes.livedApartSinceLastIncidentDate': 'no',
      'changes.approximateDatesOfLivingTogetherField': 'details...' };
    const sessionData = {
      case: {
        data: {
          claimsCosts: 'No'
        }
      }
    };
    return question.redirectWithField(
      LivedApartSinceLastIncidentDate,
      fields,
      ShareCourtDocuments,
      sessionData
    );
  });

  it('redirects to ShareCourtDocuments if answered yes and claimsCosts is No', () => {
    const fields = {
      'changes.livedApartSinceLastIncidentDate': 'yes'
    };
    const sessionData = {
      case: {
        data: {
          claimsCosts: 'No'
        }
      }
    };
    return question.redirectWithField(
      LivedApartSinceLastIncidentDate,
      fields,
      ShareCourtDocuments,
      sessionData
    );
  });

  it('returns correct answers if answered yes', () => {
    const expectedContent = [
      // eslint-disable-next-line max-len
      LivedApartSinceLastIncidentDateContent.en.fields.changes.livedApartSinceLastIncidentDate.yes
    ];

    const stepData = {
      changes: {
        livedApartSinceLastIncidentDate: 'yes'
      }
    };
    return question.answers(
      LivedApartSinceLastIncidentDate,
      stepData,
      expectedContent,
      session
    );
  });

  it('returns correct answers if answered no', () => {
    const expectedContent = [
      // eslint-disable-next-line max-len
      LivedApartSinceLastIncidentDateContent.en.fields.changes.livedApartSinceLastIncidentDate.no
    ];

    const stepData = {
      changes: {
        livedApartSinceLastIncidentDate: 'no'
      }
    };
    return question.answers(LivedApartSinceLastIncidentDate, stepData, expectedContent, session);
  });

  describe('Returns correct values()', () => {
    it('livedApartSinceLastIncidentDate : yes ', () => {
      const selectedValue = 'yes';
      const detailsGiven = 'We are living together after last incident date';
      const fields = {
        changes: {
          livedApartSinceLastIncidentDate: selectedValue,
          approximateDatesOfLivingTogetherField: detailsGiven
        }
      };
      const req = {
        journey: {},
        session: { LivedApartSinceLastIncidentDate: fields }
      };

      const res = {};
      const step = new LivedApartSinceLastIncidentDate(req, res);
      step.retrieve().validate();

      const _values = step.values();
      expect(_values).to.be.an('object');
      expect(_values).to.have.property('changes.livedApartSinceLastIncidentDate', selectedValue);
      expect(_values).to.not.have.property('changes.approximateDatesOfLivingTogetherField');
    });

    it('livedApartSinceLastIncidentDate : no ', () => {
      const selectedValue = 'no';
      const detailsGiven = 'We are living together after last incident date';
      const fields = {
        changes: {
          livedApartSinceLastIncidentDate: selectedValue,
          approximateDatesOfLivingTogetherField: detailsGiven
        }
      };
      const req = {
        journey: {},
        session: { LivedApartSinceLastIncidentDate: fields }
      };

      const res = {};
      const step = new LivedApartSinceLastIncidentDate(req, res);
      step.retrieve().validate();

      const _values = step.values();
      expect(_values).to.be.an('object');
      expect(_values).to.have.property('changes.livedApartSinceLastIncidentDate', selectedValue);
      expect(_values).to.have.property(
        'changes.approximateDatesOfLivingTogetherField', detailsGiven
      );
    });
  });
});
