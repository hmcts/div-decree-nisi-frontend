const { journey, sinon } = require('@hmcts/one-per-page-test-suite');
const request = require('request-promise-native');
const { merge } = require('lodash');
const mockCaseResponse = require('mocks/services/case-orchestration/retrieve-case/mock-case');
const config = require('config');
const moment = require('moment');

const Start = require('steps/start/Start.step');
const IdamLogin = require('mocks/steps/idamLogin/IdamLogin.step');
const petitionProgressBar = require('steps/petition-progress-bar/PetitionProgressBar.step');
const ApplyForDecreeNisi = require('steps/apply-for-decree-nisi/ApplyForDecreeNisi.step');
const MiniPetition = require('steps/mini-petition/MiniPetition.step');
const Entry = require('steps/entry/Entry.step');

const BehaviourContinuedSinceApplication = require(
  'steps/behaviour-continued-since-application/BehaviourContinuedSinceApplication.step'
);
const LivedApartSinceLastIncidentDate = require(
  'steps/lived-apart-since-last-incident-date/LivedApartSinceLastIncidentDate.step'
);
const ClaimCosts = require('steps/claim-costs/ClaimCosts.step');
const ShareCourtDocuments = require('steps/share-court-documents/ShareCourtDocuments.step');
const CheckYourAnswers = require('steps/check-your-answers/CheckYourAnswers.step');
const Done = require('steps/done/Done.step');

const session = {
  reasonForDivorce: 'unreasonable-behaviour',
  respWillDefendDivorce: null,
  reasonForDivorceBehaviourDetails: 'details'
};

const matchParam = (paramName, expected) => actual => {
  const paramValue = JSON.stringify(actual[paramName]);
  return JSON.stringify(expected) === paramValue;
};

let caseOrchestrationServiceSubmitStub = {};

describe('Unreasonable behaviour', () => {
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
  });

  after(() => {
    request.get.restore();
    request.post.restore();
  });

  describe('behaviourContinuedSinceApplication : yes', () => {
    journey.test([
      { step: Start },
      { step: IdamLogin, body: { success: 'yes' } },
      { step: Entry },
      { step: petitionProgressBar },
      { step: ApplyForDecreeNisi, body: { applyForDecreeNisi: 'yes' } },
      {
        step: MiniPetition,
        body: {
          'changes-hasBeenChanges': 'no',
          'changes-statementOfTruthNoChanges': 'yes'
        }
      },
      { step: BehaviourContinuedSinceApplication, body: {
        'changes-behaviourContinuedSinceApplication': 'yes'
      } },
      { step: ClaimCosts, body: { 'dnCosts-claimCosts': 'originalAmount' } },
      { step: ShareCourtDocuments, body: { upload: 'no' } },
      { step: CheckYourAnswers, body: { statementOfTruth: 'yes' } },
      { step: Done }
    ]);

    it('submits correct body to case orchestration service', () => {
      const body = {
        applyForDecreeNisi: 'yes',
        statementOfTruthChanges: 'yes',
        claimCosts: 'originalAmount',
        uploadAnyOtherDocuments: 'no',
        statementOfTruth: 'yes',
        behaviourContinuedSinceApplication: 'yes',
        lastIncidentDate: moment('')
      };
      sinon.assert.calledWith(
        caseOrchestrationServiceSubmitStub,
        sinon.match(matchParam('body', body)
        )
      );
    });
  });

  describe('behaviourContinuedSinceApplication : no', () => {
    journey.test([
      { step: Start },
      { step: IdamLogin, body: { success: 'yes' } },
      { step: Entry },
      { step: petitionProgressBar },
      { step: ApplyForDecreeNisi, body: { applyForDecreeNisi: 'yes' } },
      {
        step: MiniPetition,
        body: {
          'changes-hasBeenChanges': 'no',
          'changes-statementOfTruthNoChanges': 'yes'
        }
      },
      { step: BehaviourContinuedSinceApplication, body: {
        'changes-behaviourContinuedSinceApplication': 'no',
        'changes-lastIncidentDate-day': '20',
        'changes-lastIncidentDate-month': '08',
        'changes-lastIncidentDate-year': '2018'
      } },
      { step: LivedApartSinceLastIncidentDate, body: {
        'changes-livedApartSinceLastIncidentDate': 'yes'
      }
      },  // eslint-disable-line
      { step: ClaimCosts, body: { 'dnCosts-claimCosts': 'originalAmount' } },
      { step: ShareCourtDocuments, body: { upload: 'no' } },
      { step: CheckYourAnswers, body: { statementOfTruth: 'yes' } },
      { step: Done }
    ]);

    it('submits correct body to case orchestration service', () => {
      const body = {
        applyForDecreeNisi: 'yes',
        statementOfTruthChanges: 'yes',
        claimCosts: 'originalAmount',
        uploadAnyOtherDocuments: 'no',
        statementOfTruth: 'yes',
        behaviourContinuedSinceApplication: 'no',
        lastIncidentDate: moment('2018-08-20T00:00:00.000'),
        livedApartSinceLastIncidentDate: 'yes'
      };
      sinon.assert.calledWith(
        caseOrchestrationServiceSubmitStub,
        sinon.match(matchParam('body', body)
        )
      );
    });
  });
});
