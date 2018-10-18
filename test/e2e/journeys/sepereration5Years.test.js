const { journey, sinon } = require('@hmcts/one-per-page-test-suite');
const request = require('request-promise-native');
const { merge } = require('lodash');
const mockCaseResponse = require('mocks/services/case-orchestration/retrieve-aos-case/mock-case');
const config = require('config');

const Start = require('steps/start/Start.step');
const IdamLogin = require('mocks/steps/idamLogin/IdamLogin.step');
const Undefended = require('steps/undefended/Undefended.step');
const ApplyForDecreeNisi = require('steps/apply-for-decree-nisi/ApplyForDecreeNisi.step');
const MiniPetition = require('steps/mini-petition/MiniPetition.step');
const LivedApartSinceSeparation = require(
  'steps/lived-apart-since-separation/LivedApartSinceSeparation.step'
);
const ClaimCosts = require('steps/claim-costs/ClaimCosts.step');
const ShareCourtDocuments = require('steps/share-court-documents/ShareCourtDocuments.step');
const CheckYourAnswers = require('steps/check-your-answers/CheckYourAnswers.step');
const Done = require('steps/done/Done.step');

const session = {
  reasonForDivorce: 'separation-5-years',
  respDefendsDivorce: null
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
    { step: Undefended },
    { step: ApplyForDecreeNisi, body: { applyForDecreeNisi: 'yes' } },
    {
      step: MiniPetition,
      body: {
        'changes-hasBeenChanges': 'no',
        'changes-statementOfTruthNoChanges': 'yes'
      }
    },
    { step: LivedApartSinceSeparation, body: { 'changes-livedApartSinceSeparation': 'yes' } },
    { step: ClaimCosts, body: { claimCosts: 'originalAmount' } },
    { step: ShareCourtDocuments, body: { upload: 'no' } },
    { step: CheckYourAnswers, body: { statementOfTruth: 'yes' } },
    { step: Done }
  ]);
});
