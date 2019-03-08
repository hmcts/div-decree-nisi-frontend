const { journey, sinon } = require('@hmcts/one-per-page-test-suite');
const request = require('request-promise-native');
const { merge } = require('lodash');
const mockCaseResponse = require('mocks/services/case-orchestration/retrieve-case/mock-case');
const config = require('config');

const Start = require('steps/start/Start.step');
const IdamLogin = require('mocks/steps/idamLogin/IdamLogin.step');
const petitionProgressBar = require('steps/petition-progress-bar/PetitionProgressBar.step');
const reviewAosResponse = require('steps/review-aos-response/ReviewAosResponse.step');
const respNotAdmitAdultery = require('steps/resp-not-admit-adultery/RespNotAdmitAdultery.step');
const ApplyForDecreeNisi = require('steps/apply-for-decree-nisi/ApplyForDecreeNisi.step');
const MiniPetition = require('steps/mini-petition/MiniPetition.step');
const Intolerable = require('steps/intolerable/Intolerable.step');
const ExitIntolerable = require('steps/exit-intolerable/ExitIntolerable.step');
const AdulteryFirstFoundOut = require('steps/adultery-first-found-out/AdulteryFirstFoundOut.step');
const LivedApartSinceAdultery = require(
  'steps/lived-apart-since-adultery/LivedApartSinceAdultery.step'
);
// eslint-disable-next-line max-len
const ReviewAosResponseFromCoRespondent = require('steps/review-aos-response-from-co-respondent/ReviewAosResponseFromCoRespondent.step');
const moment = require('moment');
const Entry = require('steps/entry/Entry.step');

const ClaimCosts = require('steps/claim-costs/ClaimCosts.step');
const ShareCourtDocuments = require('steps/share-court-documents/ShareCourtDocuments.step');
const CheckYourAnswers = require('steps/check-your-answers/CheckYourAnswers.step');
const Done = require('steps/done/Done.step');

const feesAndPaymentsService = require('services/feesAndPaymentsService');

const session = {
  reasonForDivorce: 'adultery',
  respWillDefendDivorce: null,
  reasonForDivorceAdulteryDetails: 'details'
};

let caseOrchestrationServiceSubmitStub = {};

const matchParam = (paramName, expected) => actual => {
  const paramValue = JSON.stringify(actual[paramName]);
  return JSON.stringify(expected) === paramValue;
};


describe('Adultery DN flow', () => {
  before(() => {
    const getStub = sinon.stub(request, 'get');
    const postStub = sinon.stub(request, 'post');

    getStub
      .withArgs(sinon.match({
        uri: `${config.services.orchestrationService.getCaseUrl}`
      }))
      .resolves(merge({}, mockCaseResponse, { data: session }));

    caseOrchestrationServiceSubmitStub = postStub
      .withArgs(sinon.match({
        uri: `${config.services.orchestrationService.submitCaseUrl}/${mockCaseResponse.caseId}`
      }));
    caseOrchestrationServiceSubmitStub.resolves();

    sinon.stub(feesAndPaymentsService, 'getFee')
      .resolves({
        feeCode: 'FEE0002',
        version: 4,
        amount: 550.00,
        description: 'Filing an application for a divorce, nullity or civil partnership dissolution – fees order 1.2.' // eslint-disable-line max-len
      });
  });

  after(() => {
    request.get.restore();
    request.post.restore();
    feesAndPaymentsService.getFee.restore();
  });

  describe('Intolerable: yes, livedApartSinceAdultery: yes', () => {
    journey.test([
      { step: Start },
      { step: IdamLogin, body: { success: 'yes' } },
      { step: Entry },
      { step: petitionProgressBar },
      { step: ApplyForDecreeNisi, body: { applyForDecreeNisi: 'yes' } },
      {
        step: MiniPetition,
        body: {
          'changes.hasBeenChanges': 'no',
          'changes.statementOfTruthNoChanges': 'yes'
        }
      },
      { step: Intolerable, body: { intolerable: 'yes' } },
      { step: AdulteryFirstFoundOut, body: {
        'adulteryFirstFoundDate.day': '09',
        'adulteryFirstFoundDate.month': '08',
        'adulteryFirstFoundDate.year': '2011'
      } },
      { step: LivedApartSinceAdultery, body: { 'livedApart.livedApartSinceAdultery': 'yes' } },
      { step: ClaimCosts, body: { 'dnCosts.claimCosts': 'originalAmount' } },
      { step: ShareCourtDocuments, body: { upload: 'no' } },
      { step: CheckYourAnswers, body: { statementOfTruth: 'yes' } },
      { step: Done }
    ]);

    it('submits correct body to case orchestration service', () => {
      const body = {
        applyForDecreeNisi: 'yes',
        hasBeenChanges: 'no',
        statementOfTruthChanges: 'yes',
        claimCosts: 'originalAmount',
        uploadAnyOtherDocuments: 'no',
        statementOfTruth: 'yes',
        intolerable: 'yes',
        adulteryFirstFoundDate: moment('2011-08-09T00:00:00.000'),
        livedApartSinceAdultery: 'yes'
      };
      sinon.assert.calledWith(
        caseOrchestrationServiceSubmitStub,
        sinon.match(matchParam('body', body)
        )
      );
    });
  });

  describe('Intolerable: yes, livedApartSinceAdultery: no', () => {
    journey.test([
      { step: Start },
      { step: IdamLogin, body: { success: 'yes' } },
      { step: Entry },
      { step: petitionProgressBar },
      { step: ApplyForDecreeNisi, body: { applyForDecreeNisi: 'yes' } },
      {
        step: MiniPetition,
        body: {
          'changes.hasBeenChanges': 'no',
          'changes.statementOfTruthNoChanges': 'yes'
        }
      },
      { step: Intolerable, body: { intolerable: 'yes' } },
      { step: AdulteryFirstFoundOut, body: {
        'adulteryFirstFoundDate.day': '09',
        'adulteryFirstFoundDate.month': '08',
        'adulteryFirstFoundDate.year': '2011'
      } },
      { step: LivedApartSinceAdultery, body: {
        'livedApart.livedApartSinceAdultery': 'no',
        'livedApart.datesLivedTogether': '3 months'
      } },
      { step: ClaimCosts, body: { 'dnCosts.claimCosts': 'originalAmount' } },
      { step: ShareCourtDocuments, body: { upload: 'no' } },
      { step: CheckYourAnswers, body: { statementOfTruth: 'yes' } },
      { step: Done }
    ]);

    it('submits correct body to case orchestration service', () => {
      const body = {
        applyForDecreeNisi: 'yes',
        hasBeenChanges: 'no',
        statementOfTruthChanges: 'yes',
        claimCosts: 'originalAmount',
        uploadAnyOtherDocuments: 'no',
        statementOfTruth: 'yes',
        intolerable: 'yes',
        adulteryFirstFoundDate: moment('2011-08-09T00:00:00.000'),
        livedApartSinceAdultery: 'no',
        datesLivedTogether: '3 months'
      };
      sinon.assert.calledWith(
        caseOrchestrationServiceSubmitStub,
        sinon.match(matchParam('body', body)
        )
      );
    });
  });

  describe('Intolerable: no', () => {
    journey.test([
      { step: Start },
      { step: IdamLogin, body: { success: 'yes' } },
      { step: Entry },
      { step: petitionProgressBar },
      { step: ApplyForDecreeNisi, body: { applyForDecreeNisi: 'yes' } },
      {
        step: MiniPetition,
        body: {
          'changes.hasBeenChanges': 'no',
          'changes.statementOfTruthNoChanges': 'yes'
        }
      },
      { step: Intolerable, body: { intolerable: 'no' } },
      { step: ExitIntolerable }
    ]);
  });
});


describe('Respondent Admitted Adultery : no', () => {
  const sess = {
    reasonForDivorce: 'adultery',
    respWillDefendDivorce: 'Yes',
    respAdmitOrConsentToFact: 'No',
    reasonForDivorceAdulteryDetails: 'details'
  };

  const sandbox = sinon.createSandbox();

  before(() => {
    sandbox.replace(config.features, 'release520', true);

    const getStub = sinon.stub(request, 'get');
    const postStub = sinon.stub(request, 'post');

    getStub
      .withArgs(sinon.match({
        uri: `${config.services.orchestrationService.getCaseUrl}`
      }))
      .resolves(merge({}, mockCaseResponse, { data: sess }));

    caseOrchestrationServiceSubmitStub = postStub
      .withArgs(sinon.match({
        uri: `${config.services.orchestrationService.submitCaseUrl}/${mockCaseResponse.caseId}`
      }));
    caseOrchestrationServiceSubmitStub.resolves();

    sinon.stub(feesAndPaymentsService, 'getFee')
      .resolves({
        feeCode: 'FEE0002',
        version: 4,
        amount: 550.00,
        description: 'Filing an application for a divorce, nullity or civil partnership dissolution – fees order 1.2.' // eslint-disable-line max-len
      });
  });

  after(() => {
    request.get.restore();
    request.post.restore();
    sandbox.restore();
    feesAndPaymentsService.getFee.restore();
  });

  describe('Intolerable: yes, livedApartSinceAdultery: yes', () => {
    journey.test([
      { step: Start },
      { step: IdamLogin, body: { success: 'yes' } },
      { step: Entry },
      { step: petitionProgressBar },
      { step: reviewAosResponse, body: { reviewAosResponse: 'yes' } },
      { step: respNotAdmitAdultery, body: { amendPetition: 'no' } },
      { step: ReviewAosResponseFromCoRespondent, body: { reviewAosCRResponse: 'yes' } },
      { step: ApplyForDecreeNisi, body: { applyForDecreeNisi: 'yes' } },
      {
        step: MiniPetition,
        body: {
          'changes.hasBeenChanges': 'no',
          'changes.statementOfTruthNoChanges': 'yes'
        }
      },
      { step: Intolerable, body: { intolerable: 'yes' } },
      { step: AdulteryFirstFoundOut, body: {
        'adulteryFirstFoundDate.day': '09',
        'adulteryFirstFoundDate.month': '08',
        'adulteryFirstFoundDate.year': '2011'
      } },
      { step: LivedApartSinceAdultery, body: { 'livedApart.livedApartSinceAdultery': 'yes' } },
      { step: ClaimCosts, body: { 'dnCosts.claimCosts': 'originalAmount' } },
      { step: ShareCourtDocuments, body: { upload: 'no' } },
      { step: CheckYourAnswers, body: { statementOfTruth: 'yes' } },
      { step: Done }
    ]);

    it('submits correct body to case orchestration service', () => {
      const body = {
        applyForDecreeNisi: 'yes',
        hasBeenChanges: 'no',
        statementOfTruthChanges: 'yes',
        claimCosts: 'originalAmount',
        uploadAnyOtherDocuments: 'no',
        statementOfTruth: 'yes',
        intolerable: 'yes',
        adulteryFirstFoundDate: moment('2011-08-09T00:00:00.000'),
        livedApartSinceAdultery: 'yes'
      };
      sinon.assert.calledWith(
        caseOrchestrationServiceSubmitStub,
        sinon.match(matchParam('body', body)
        )
      );
    });
  });
});

describe('Respondent Admitted Adultery : no, AdulteryWishToName: Yes', () => {
  const sess = {
    reasonForDivorce: 'adultery',
    respWillDefendDivorce: 'No',
    respAdmitOrConsentToFact: 'No',
    reasonForDivorceAdulteryWishToName: 'Yes',
    coRespondentAnswers: {
      aos: {
        received: 'Yes'
      }
    }
  };

  const sandbox = sinon.createSandbox();

  before(() => {
    sandbox.replace(config.features, 'release520', true);

    const getStub = sinon.stub(request, 'get');

    getStub
      .withArgs(sinon.match({
        uri: `${config.services.orchestrationService.getCaseUrl}`
      }))
      .resolves(merge({}, mockCaseResponse, { data: sess }));
    sinon.stub(feesAndPaymentsService, 'getFee')
      .resolves({
        feeCode: 'FEE0002',
        version: 4,
        amount: 550.00,
        description: 'Filing an application for a divorce, nullity or civil partnership dissolution – fees order 1.2.' // eslint-disable-line max-len
      });
  });

  after(() => {
    request.get.restore();
    sandbox.restore();
    feesAndPaymentsService.getFee.restore();
  });

  describe('View Co-Respondents response', () => {
    journey.test([
      { step: Start },
      { step: IdamLogin, body: { success: 'yes' } },
      { step: Entry },
      { step: petitionProgressBar },
      { step: reviewAosResponse, body: { reviewAosResponse: 'yes' } },
      { step: respNotAdmitAdultery, body: { amendPetition: 'no' } },
      { step: ReviewAosResponseFromCoRespondent, body: { reviewAosCRResponse: 'yes' } },
      { step: ApplyForDecreeNisi }

    ]);
  });
});

describe('Respondent Admitted Adultery : yes, AdulteryWishToName: Yes', () => {
  const sess = {
    reasonForDivorce: 'adultery',
    respWillDefendDivorce: 'No',
    respAdmitOrConsentToFact: 'Yes',
    reasonForDivorceAdulteryWishToName: 'Yes',
    coRespondentAnswers: {
      aos: {
        received: 'Yes'
      }
    }
  };

  const sandbox = sinon.createSandbox();

  before(() => {
    sandbox.replace(config.features, 'release520', true);

    const getStub = sinon.stub(request, 'get');

    getStub
      .withArgs(sinon.match({
        uri: `${config.services.orchestrationService.getCaseUrl}`
      }))
      .resolves(merge({}, mockCaseResponse, { data: sess }));

    sinon.stub(feesAndPaymentsService, 'getFee')
      .resolves({
        feeCode: 'FEE0002',
        version: 4,
        amount: 550.00,
        description: 'Filing an application for a divorce, nullity or civil partnership dissolution – fees order 1.2.' // eslint-disable-line max-len
      });
  });

  after(() => {
    request.get.restore();
    sandbox.restore();
    feesAndPaymentsService.getFee.restore();
  });

  describe('View Co-Respondents response', () => {
    journey.test([
      { step: Start },
      { step: IdamLogin, body: { success: 'yes' } },
      { step: Entry },
      { step: petitionProgressBar },
      { step: reviewAosResponse, body: { reviewAosResponse: 'yes' } },
      { step: ReviewAosResponseFromCoRespondent, body: { reviewAosCRResponse: 'yes' } },
      { step: ApplyForDecreeNisi }
    ]);
  });
});