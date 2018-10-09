const modulePath = 'steps/claim-costs/ClaimCosts.step';

const ClaimCosts = require(modulePath);
const ClaimCostsContent = require('steps/claim-costs/ClaimCosts.content');
const ShareCourtDocuments = require('steps/share-court-documents/ShareCourtDocuments.step');
const idam = require('services/idam');
const { middleware, question, sinon,
  content, expect, itParam } = require('@hmcts/one-per-page-test-suite');

const session = { case: { data: {} } };

describe(modulePath, () => {
  const optionValues = {
    respAmount: 'respAmount',
    originalAmount: 'originalAmount',
    alterAmount: 'alterAmount',
    dontClaim: 'dontClaim'
  };

  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(ClaimCosts, [ idam.protect() ]);
  });

  it('renders the content', () => {
    return content(ClaimCosts, session);
  });

  describe('Validate errors', () => {
    it('shows error if does not answer question', () => {
      const testOptions = {
        onlyErrors: ['required']
      };
      return question.testErrors(ClaimCosts, session, {}, testOptions);
    });

    it('shows error if does not fill amount ', () => {
      const testOptions = {
        onlyErrors: ['costsDifferentAmountRequired']
      };

      const fields = {
        'claimCosts-divorceCostsOption': optionValues.alterAmount
      };

      return question.testErrors(ClaimCosts, session, fields, testOptions);
    });
  });

  describe('Validate redirect', () => {
    const options = [optionValues.dontClaim, optionValues.originalAmount, optionValues.respAmount];

    itParam('redirects to ShareCourtDocuments if answer is ${value}', options, option => {
      const fields = { 'claimCosts-divorceCostsOption': option };
      return question.redirectWithField(ClaimCosts, fields, ShareCourtDocuments, session);
    });

    it('redirects to ShareCourtDocuments if answer is differentAmount', () => {
      const fields = {
        'claimCosts-divorceCostsOption': optionValues.alterAmount,
        'claimCosts-costsDifferentAmount': '10 pound and reason'
      };
      return question.redirectWithField(ClaimCosts, fields, ShareCourtDocuments, session);
    });
  });

  describe('Validate renders', () => {
    const options = [
      optionValues.dontClaim,
      optionValues.originalAmount,
      optionValues.respAmount,
      optionValues.alterAmount
    ];
    itParam('loads field ${value} from the session', options, option => {
      const sessionData = { 'claimCosts-divorceCostsOption': option };
      return question.rendersValues(ClaimCosts, sessionData, session);
    });
  });

  describe('Validate answers', () => {
    it('returns correct answers', () => {
      const amountToClaim = '10 pound and reason';
      const expectedContent = [
        ClaimCostsContent.en.fields.claimCosts.title,
        ClaimCostsContent.en.fields.claimCosts.differentAmount,
        ClaimCostsContent.en.fields.amountToClaimAndReason.question,
        amountToClaim
      ];

      const sessionData = { claimCosts: {
        divorceCostsOption: optionValues.alterAmount,
        costsDifferentAmount: amountToClaim
      } };
      return question.answers(ClaimCosts, sessionData, expectedContent, session);
    });
  });

  describe('Validate values', () => {
    const optionsWithoutAmount = [
      optionValues.dontClaim,
      optionValues.originalAmount,
      optionValues.respAmount
    ];

    itParam('when ${value} then new amount is not present', optionsWithoutAmount, option => {
      const fields = {
        claimCosts: {
          divorceCostsOption: option,
          costsDifferentAmount: '10 pound and reason'
        }
      };
      const req = {
        journey: {},
        session: { ClaimCosts: fields }
      };

      const res = {};
      const step = new ClaimCosts(req, res);
      step.retrieve().validate();

      const _values = step.values();

      expect(_values).to.be.an('object');
      expect(_values).to.have.property('divorceCostsOption', option);
      expect(_values).to.not.have.property('respCostsAmount');
    });

    it('when ask to  pay a different amount then new amount is required', () => {
      const amountAsked = '10 pound and reason';
      const fields = {
        claimCosts: {
          divorceCostsOption: optionValues.alterAmount,
          costsDifferentAmount: amountAsked
        }
      };
      const req = {
        journey: {},
        session: { ClaimCosts: fields }
      };

      const res = {};
      const step = new ClaimCosts(req, res);
      step.retrieve().validate();

      const _values = step.values();

      expect(_values).to.be.an('object');
      expect(_values).to.have.property('divorceCostsOption', optionValues.alterAmount);
      expect(_values).to.have.property('costsDifferentAmount', amountAsked);
    });
  });
});
