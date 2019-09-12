const modulePath = 'steps/claim-costs/ClaimCosts.step';

const ClaimCosts = require(modulePath);
const ClaimCostsContent = require('steps/claim-costs/ClaimCosts.content');
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
    return middleware.hasMiddleware(ClaimCosts, [ idam.protect() ]);
  });

  describe('renders content', () => {
    it('renders the content when respondent agrees to pay', () => {
      const sess = { case: { data: { respAgreeToCosts: 'Yes' } } };
      const ignoreContent = [
        'webChatTitle',
        'chatDown',
        'chatWithAnAgent',
        'noAgentsAvailable',
        'allAgentsBusy',
        'chatClosed',
        'chatAlreadyOpen',
        'chatOpeningHours',
        'respNotPay'
      ];
      return content(ClaimCosts, sess, { ignoreContent });
    });

    it('renders the content when respondent does not agree to pay', () => {
      const sess = { case: { data: { respAgreeToCosts: 'No', respCostsReason: 'Test Reason' } } };
      const ignoreContent = [
        'webChatTitle',
        'chatDown',
        'chatWithAnAgent',
        'noAgentsAvailable',
        'allAgentsBusy',
        'chatClosed',
        'chatAlreadyOpen',
        'chatOpeningHours',
        'respPay'
      ];
      return content(ClaimCosts, sess, { ignoreContent });
    });

    it('loads fields from the session', () => {
      const stepData = { 'dnCosts.claimCosts': 'endClaim' };
      return question.rendersValues(ClaimCosts, stepData, session);
    });
  });

  describe('Test errors', () => {
    it('Error if does not answer question', () => {
      const onlyErrors = ['required'];
      return question.testErrors(ClaimCosts, session, {}, { onlyErrors });
    });

    it('Error if answered differentAmount and no data entered', () => {
      const onlyErrors = ['requiredCostsDifferentDetails'];
      const fields = { 'dnCosts.claimCosts': 'differentAmount',
        'dnCosts.costsDifferentDetails': '' };
      return question.testErrors(ClaimCosts, session, fields, { onlyErrors });
    });
  });

  describe('Navigation', () => {
    it('To ShareCourtDocuments if answer is originalAmount', () => {
      const fields = { 'dnCosts.claimCosts': 'originalAmount' };
      return question.redirectWithField(ClaimCosts, fields, ShareCourtDocuments, session);
    });

    it('To ShareCourtDocuments if answer is differentAmount and details provided', () => {
      const fields = { 'dnCosts.claimCosts': 'differentAmount',
        'dnCosts.costsDifferentDetails': 'I want to pay 60%' };
      return question.redirectWithField(ClaimCosts, fields, ShareCourtDocuments, session);
    });

    it('To ShareCourtDocuments if answer is endClaim', () => {
      const fields = { 'dnCosts.claimCosts': 'endClaim' };
      return question.redirectWithField(ClaimCosts, fields, ShareCourtDocuments, session);
    });
  });

  describe('Returns correct answers', () => {
    it('claimCosts : originalAmount ', () => {
      const stepData = {
        dnCosts: {
          claimCosts: 'originalAmount'
        }
      };
      const expectedContent = [
        ClaimCostsContent.en.fields.dnCosts.title,
        ClaimCostsContent.en.fields.dnCosts.originalAmount
      ];
      return question.answers(ClaimCosts, stepData, expectedContent, session);
    });

    it('claimCosts : differentAmount, costsDifferentDetails: I want to pay 60% ', () => {
      const stepData = {
        dnCosts: {
          claimCosts: 'differentAmount',
          costsDifferentDetails: 'I want to pay 60%'
        }
      };
      const expectedContent = [
        ClaimCostsContent.en.fields.dnCosts.title,
        ClaimCostsContent.en.fields.dnCosts.differentAmount,
        ClaimCostsContent.en.fields.dnCosts.costsDifferentDetails.title,
        stepData.dnCosts.costsDifferentDetails
      ];
      return question.answers(ClaimCosts, stepData, expectedContent, session);
    });
  });

  describe('Returns correct values()', () => {
    it('claimCosts : originalAmount ', () => {
      const claimCostsValue = 'originalAmount';
      const fields = {
        dnCosts: {
          claimCosts: claimCostsValue
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
      expect(_values).to.have.property('dnCosts.claimCosts', claimCostsValue);
      expect(_values).to.not.have.property('dnCosts.costsDifferentDetails');
    });

    it('claimCosts : differentAmount ', () => {
      const claimCostsValue = 'differentAmount';
      const diffCostValue = 'I want to pay 70%';
      const fields = {
        dnCosts: {
          claimCosts: claimCostsValue,
          costsDifferentDetails: diffCostValue
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
      expect(_values).to.have.property('dnCosts.claimCosts', claimCostsValue);
      expect(_values).to.have.property('dnCosts.costsDifferentDetails', diffCostValue);
    });

    it('claimCosts : endClaim ', () => {
      const claimCostsValue = 'endClaim';
      const fields = {
        dnCosts: {
          claimCosts: claimCostsValue
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
      expect(_values).to.have.property('dnCosts.claimCosts', claimCostsValue);
      expect(_values).to.not.have.property('dnCosts.costsDifferentDetails');
    });
  });
});
