const modulePath = 'steps/lived-apart-since-adultery/LivedApartSinceAdultery.step';

const LivedApartSinceAdultery = require(modulePath);
const LivedApartSinceAdulteryContent = require(
  'steps/lived-apart-since-adultery/LivedApartSinceAdultery.content'
);
const ShareCourtDocuments = require('steps/share-court-documents/ShareCourtDocuments.step');
const ClaimCosts = require('steps/claim-costs/ClaimCosts.step');
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
    return middleware.hasMiddleware(LivedApartSinceAdultery, [ idam.protect() ]);
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
      'languageToggle'
    ];

    return content(LivedApartSinceAdultery, session, { ignoreContent });
  });

  describe('errors', () => {
    it('shows error if does not answer question', () => {
      const onlyErrors = ['required', 'requireDatesLivedTogether'];
      return question.testErrors(LivedApartSinceAdultery, session, {}, { onlyErrors });
    });

    it('shows error if user answers no and does not enter date', () => {
      const onlyErrors = ['requireDatesLivedTogether'];
      const fields = { 'livedApart.livedApartSinceAdultery': 'no' };
      return question.testErrors(LivedApartSinceAdultery, session, fields, { onlyErrors });
    });
  });

  it('redirects to ClaimCosts if answer is yes', () => {
    const fields = { 'livedApart.livedApartSinceAdultery': 'yes' };
    const sessionData = {
      case: {
        data: {
          claimsCosts: 'Yes'
        }
      }
    };
    return question.redirectWithField(LivedApartSinceAdultery, fields, ClaimCosts, sessionData);
  });

  it('redirects to ShareCourtDocuments if answered yes and claimsCosts is No', () => {
    const fields = { 'livedApart.livedApartSinceAdultery': 'yes' };
    const sessionData = {
      case: {
        data: {
          claimsCosts: 'No'
        }
      }
    };
    return question.redirectWithField(
      LivedApartSinceAdultery,
      fields,
      ShareCourtDocuments,
      sessionData
    );
  });

  it('redirects to ClaimCosts if answer is no and dates givent', () => {
    const fields = {
      'livedApart.livedApartSinceAdultery': 'no',
      'livedApart.datesLivedTogether': '3 months'
    };
    return question.redirectWithField(LivedApartSinceAdultery, fields, ClaimCosts, session);
  });

  it('redirects to ShareCourtDocuments if answered no, dates, claimsCosts is No', () => {
    const fields = {
      'livedApart.livedApartSinceAdultery': 'no',
      'livedApart.datesLivedTogether': '3 months'
    };
    const sessionData = {
      case: {
        data: {
          claimsCosts: 'No'
        }
      }
    };
    return question.redirectWithField(
      LivedApartSinceAdultery,
      fields,
      ShareCourtDocuments,
      sessionData
    );
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

  describe('Returns correct values()', () => {
    it('livedApartSinceAdultery : yes ', () => {
      const selectedValue = 'yes';
      const detailsGiven = 'We are living together after adultery';
      const fields = {
        livedApart: {
          livedApartSinceAdultery: selectedValue,
          datesLivedTogether: detailsGiven
        }
      };
      const req = {
        journey: {},
        session: { LivedApartSinceAdultery: fields }
      };

      const res = {};
      const step = new LivedApartSinceAdultery(req, res);
      step.retrieve().validate();

      const _values = step.values();
      expect(_values).to.be.an('object');
      expect(_values).to.have.property('livedApart.livedApartSinceAdultery', selectedValue);
      expect(_values).to.not.have.property('livedApart.datesLivedTogether');
    });

    it('livedApartSinceAdultery : no ', () => {
      const selectedValue = 'no';
      const detailsGiven = 'We are living together after adultery';
      const fields = {
        livedApart: {
          livedApartSinceAdultery: selectedValue,
          datesLivedTogether: detailsGiven
        }
      };
      const req = {
        journey: {},
        session: { LivedApartSinceAdultery: fields }
      };

      const res = {};
      const step = new LivedApartSinceAdultery(req, res);
      step.retrieve().validate();

      const _values = step.values();
      expect(_values).to.be.an('object');
      expect(_values).to.have.property('livedApart.livedApartSinceAdultery', selectedValue);
      expect(_values).to.have.property('livedApart.datesLivedTogether', detailsGiven);
    });
  });

  describe('watches', () => {
    it('removes datesLivedTogether if livedApartSinceAdultery changes to yes', () => {
      const instance = new LivedApartSinceAdultery({ journey: {} });
      const remove = sinon.stub();

      const watch = instance.watches['LivedApartSinceAdultery.livedApart.livedApartSinceAdultery'];
      watch('no', 'yes', remove);

      expect(remove).calledWith('LivedApartSinceAdultery.livedApart.datesLivedTogether');
    });
  });
});
