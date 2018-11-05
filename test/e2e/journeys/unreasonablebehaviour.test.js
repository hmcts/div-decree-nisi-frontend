const { journey, sinon } = require('@hmcts/one-per-page-test-suite');
const request = require('request-promise-native');
const { merge } = require('lodash');
const mockCaseResponse = require('mocks/services/case-orchestration/retrieve-aos-case/mock-case');
const config = require('config');

const Start = require('steps/start/Start.step');
const IdamLogin = require('mocks/steps/idamLogin/IdamLogin.step');
const petitionProgressBar = require('steps/petition-progress-bar/PetitionProgressBar.step');
const ApplyForDecreeNisi = require('steps/apply-for-decree-nisi/ApplyForDecreeNisi.step');
const MiniPetition = require('steps/mini-petition/MiniPetition.step');

const BehaviourContinuedSinceApplication = 'steps/behaviour-continued-since-application/BehaviourContinuedSinceApplication.step';  // eslint-disable-line

const ClaimCosts = require('steps/claim-costs/ClaimCosts.step');
const ShareCourtDocuments = require('steps/share-court-documents/ShareCourtDocuments.step');
const CheckYourAnswers = require('steps/check-your-answers/CheckYourAnswers.step');
const Done = require('steps/done/Done.step');

const session = {
  reasonForDivorce: 'unreasonable-behaviour',
  respDefendsDivorce: null,
  reasonForDivorceBehaviourDetails: 'details'
};

describe('Sepereration 5 years', () => {
  before(() => {
    const getStub = sinon.stub(request, 'get');
    const postStub = sinon.stub(request, 'post');

    getStub
      .withArgs(sinon.match({
        uri: `${config.services.orchestrationService.getCaseUrl}?checkCcd=true`
      }))
      .resolves(merge({}, mockCaseResponse, { data: session }));

    postStub
      .withArgs(sinon.match({
        uri: `${config.services.orchestrationService.submitCaseUrl}/${mockCaseResponse.caseId}`
      }))
      .resolves();
  });

  after(() => {
    request.get.restore();
    request.post.restore();
  });

  journey.test([
    { step: Start },
    { step: IdamLogin, body: { success: 'yes' } },
    { step: petitionProgressBar },
    { step: ApplyForDecreeNisi, body: { applyForDecreeNisi: 'yes' } },
    {
      step: MiniPetition,
      body: {
        'changes-hasBeenChanges': 'no',
        'changes-statementOfTruthNoChanges': 'yes'
      }
    },
    { step: BehaviourContinuedSinceApplication, body: { 'changes-behaviourContinuedSinceApplication': 'yes' } },  // eslint-disable-line
    { step: ClaimCosts, body: { claimCosts: 'originalAmount' } },
    { step: ShareCourtDocuments, body: { upload: 'no' } },
    { step: CheckYourAnswers, body: { statementOfTruth: 'yes' } },
    { step: Done }
  ]);
});
