const modulePath = 'steps/lived-apart-since-separation/LivedApartSinceSeparation.step';

const LivedApartSinceSeparation = require(modulePath);
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
    return middleware.hasMiddleware(LivedApartSinceSeparation, [ idam.protect() ]);
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
      'chatOpeningHours'
    ];

    return content(LivedApartSinceSeparation, session, { ignoreContent });
  });

  it('shows error if does not answer question', () => {
    const onlyErrors = ['required'];
    return question.testErrors(LivedApartSinceSeparation, session, {}, { onlyErrors });
  });

  it('shows error if answered no and no data entered', () => {
    const onlyErrors = ['requireDatesOfLivingTogether'];
    const fields = { 'changes.livedApartSinceSeparation': 'no',
      'changes.approximateDatesOfLivingTogetherField': '' };
    return question.testErrors(LivedApartSinceSeparation, session, fields, { onlyErrors });
  });

  it('redirects to ClaimCosts if answered no, details, claimsCosts is Yes', () => {
    const fields = { 'changes.livedApartSinceSeparation': 'no',
      'changes.approximateDatesOfLivingTogetherField': 'details...' };
    const sessionData = {
      case: {
        data: {
          claimsCosts: 'Yes'
        }
      }
    };
    return question.redirectWithField(LivedApartSinceSeparation, fields, ClaimCosts, sessionData);
  });

  it('redirects to ClaimCosts if answered yes and claimsCosts is Yes', () => {
    const fields = {
      'changes.livedApartSinceSeparation': 'yes'
    };
    const sessionData = {
      case: {
        data: {
          claimsCosts: 'Yes'
        }
      }
    };
    return question.redirectWithField(LivedApartSinceSeparation, fields, ClaimCosts, sessionData);
  });

  it('redirects to ShareCourtDocuments if answered no, details, claimsCosts is No', () => {
    const fields = { 'changes.livedApartSinceSeparation': 'no',
      'changes.approximateDatesOfLivingTogetherField': 'details...' };
    const sessionData = {
      case: {
        data: {
          claimsCosts: 'No'
        }
      }
    };
    return question.redirectWithField(
      LivedApartSinceSeparation,
      fields,
      ShareCourtDocuments,
      sessionData
    );
  });

  it('redirects to ShareCourtDocuments if answered yes and claimsCosts is No', () => {
    const fields = {
      'changes.livedApartSinceSeparation': 'yes'
    };
    const sessionData = {
      case: {
        data: {
          claimsCosts: 'No'
        }
      }
    };
    return question.redirectWithField(
      LivedApartSinceSeparation,
      fields,
      ShareCourtDocuments,
      sessionData
    );
  });

  describe('Returns correct values()', () => {
    it('livedApartSinceSeparation : yes ', () => {
      const selectedValue = 'yes';
      const detailsGiven = 'We are living together';
      const fields = {
        changes: {
          livedApartSinceSeparation: selectedValue,
          approximateDatesOfLivingTogetherField: detailsGiven
        }
      };
      const req = {
        journey: {},
        session: { LivedApartSinceSeparation: fields }
      };

      const res = {};
      const step = new LivedApartSinceSeparation(req, res);
      step.retrieve().validate();

      const _values = step.values();
      expect(_values).to.be.an('object');
      expect(_values).to.have.property('changes.livedApartSinceSeparation', selectedValue);
      expect(_values).to.not.have.property('changes.approximateDatesOfLivingTogetherField');
    });

    it('livedApartSinceSeparation : no ', () => {
      const selectedValue = 'no';
      const detailsGiven = 'We are living together';
      const fields = {
        changes: {
          livedApartSinceSeparation: selectedValue,
          approximateDatesOfLivingTogetherField: detailsGiven
        }
      };
      const req = {
        journey: {},
        session: { LivedApartSinceSeparation: fields }
      };

      const res = {};
      const step = new LivedApartSinceSeparation(req, res);
      step.retrieve().validate();

      const _values = step.values();
      expect(_values).to.be.an('object');
      expect(_values).to.have.property('changes.livedApartSinceSeparation', selectedValue);
      expect(_values).to.have.property(
        'changes.approximateDatesOfLivingTogetherField', detailsGiven
      );
    });
  });
});
