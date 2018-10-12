const moduleName = 'services/caseOrchestrationService';

const caseOrchestrationService = require(moduleName);
const request = require('request-promise-native');
const config = require('config');
const { expect, sinon } = require('@hmcts/one-per-page-test-suite');

describe(moduleName, () => {
  beforeEach(() => {
    sinon.stub(request, 'get');
    sinon.stub(request, 'post');
  });

  afterEach(() => {
    request.get.restore();
    request.post.restore();
  });

  describe('get case', () => {
    it('gets application from cos', done => {
      const exampleCosResponse = { foo: 'bar' };
      request.get.resolves(exampleCosResponse);
      const req = { cookies: { '__auth-token': 'token' }, session: {} };

      const uri = `${config.services.orchestrationService.getCaseUrl}?checkCcd=true`;
      const headers = { Authorization: 'Bearer token' };

      caseOrchestrationService.getApplication(req)
        .then(response => {
          sinon.assert.calledWith(request.get, { uri, headers, json: true });
          expect(response).to.eql({ case: exampleCosResponse });
        })
        .then(done, done);
    });

    it('does not get application if already in session', done => {
      const req = { cookies: { '__auth-token': 'token' }, session: { case: {} } };

      caseOrchestrationService.getApplication(req)
        .then(() => {
          expect(request.get.called).to.eql(false);
        })
        .then(done, done);
    });
  });

  describe('submission', () => {
    let session = {};
    let req = {};
    let uri = '';
    let headers = {};

    beforeEach(() => {
      request.post.resolves();

      req = { cookies: { '__auth-token': 'token' } };

      session = {
        case: {
          caseId: '1234'
        },
        MiniPetition: {
          changes: {
            changesDetails: 'changesDetails',
            statementOfTruthChanges: 'yes',
            statementOfTruthNoChanges: 'yes'
          }
        },
        ClaimCosts: {
          claimCosts: 'yes'
        },
        CheckYourAnswers: {
          statementOfTruth: 'yes'
        },
        Intolerable: {
          changes: {
            intolerable: 'yes'
          }
        },
        Upload: {
          files: [
            {
              name: 'file 1'
            }
          ]
        }
      };

      uri = `${config.services.orchestrationService.submitCaseUrl}/${session.case.caseId}`; // eslint-disable-line
      headers = { Authorization: 'Bearer token' };
    });

    it('submits adultery case', done => {
      Object.assign(session, {
        AdulteryFirstFoundOut: {
          changes: {
            adulteryFirstFoundDate: 'adultery first found out date'
          }
        },
        livedApartSinceAdultery: {
          changes: {
            livedApartSinceAdultery: 'yes',
            datesLivedTogether: 'dates Lived Together'
          }
        }
      });

      Object.assign(req, { session });

      const body = {
        changesDetails: 'changesDetails',
        statementOfTruthChanges: 'yes',
        claimCosts: 'yes',
        statementOfTruth: 'yes',
        intolerable: 'yes',
        adulteryFirstFoundDate: 'adultery first found out date',
        livedApartSinceAdultery: 'yes',
        datesLivedTogether: 'dates Lived Together',
        files: [ { name: 'file 1' } ]
      };

      caseOrchestrationService.submitApplication(req)
        .then(() => {
          sinon.assert.calledWith(request.post, { uri, headers, json: true, body });
        })
        .then(done, done);
    });

    it('submits seperation', done => {
      Object.assign(session, {
        LivedApartSinceSeparation: {
          changes: {
            livedApartSinceSeparation: 'yes',
            approximateDatesOfLivingTogetherField: 'approximate Dates Of Living Together Field'
          }
        }
      });

      Object.assign(req, { session });

      const body = {
        changesDetails: 'changesDetails',
        statementOfTruthChanges: 'yes',
        claimCosts: 'yes',
        statementOfTruth: 'yes',
        intolerable: 'yes',
        livedApartSinceSeparation: 'yes',
        approximateDatesOfLivingTogetherField: 'approximate Dates Of Living Together Field',
        files: [ { name: 'file 1' } ]
      };

      caseOrchestrationService.submitApplication(req)
        .then(() => {
          sinon.assert.calledWith(request.post, { uri, headers, json: true, body });
        })
        .then(done, done);
    });

    it('submits desertion case', done => {
      Object.assign(session, {
        LivedApartSinceDesertion: {
          changes: {
            livedApartSinceDesertion: 'yes',
            approximateDatesOfLivingTogetherField: 'approximate Dates Of Living Together Field'
          }
        }
      });

      Object.assign(req, { session });

      const body = {
        changesDetails: 'changesDetails',
        statementOfTruthChanges: 'yes',
        claimCosts: 'yes',
        statementOfTruth: 'yes',
        intolerable: 'yes',
        livedApartSinceDesertion: 'yes',
        approximateDatesOfLivingTogetherField: 'approximate Dates Of Living Together Field',
        files: [ { name: 'file 1' } ]
      };

      caseOrchestrationService.submitApplication(req)
        .then(() => {
          sinon.assert.calledWith(request.post, { uri, headers, json: true, body });
        })
        .then(done, done);
    });

    it('submits behaviour case', done => {
      Object.assign(session, {
        LivedApartSinceDesertion: {
          changes: {
            livedApartSinceDesertion: 'yes',
            approximateDatesOfLivingTogetherField: 'approximate Dates Of Living Together Field'
          }
        }
      });

      Object.assign(req, { session });

      const body = {
        changesDetails: 'changesDetails',
        statementOfTruthChanges: 'yes',
        claimCosts: 'yes',
        statementOfTruth: 'yes',
        intolerable: 'yes',
        livedApartSinceDesertion: 'yes',
        approximateDatesOfLivingTogetherField: 'approximate Dates Of Living Together Field',
        files: [ { name: 'file 1' } ]
      };

      caseOrchestrationService.submitApplication(req)
        .then(() => {
          sinon.assert.calledWith(request.post, { uri, headers, json: true, body });
        })
        .then(done, done);
    });
  });

  it('throws error if bad response from submission', () => {
    request.post.rejects();

    const req = {
      cookies: { '__auth-token': 'token' },
      session: {
        case: {
          caseId: '1234'
        }
      }
    };

    return expect(caseOrchestrationService.submitApplication(req))
      .to.be.rejectedWith('Error');
  });

  it('throws error if bad response from get', () => {
    request.get.rejects();

    const req = {
      cookies: { '__auth-token': 'token' },
      session: {}
    };

    return expect(caseOrchestrationService.getApplication(req))
      .to.be.rejectedWith('Error');
  });
});
