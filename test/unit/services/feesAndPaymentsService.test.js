const request = require('request-promise-native');

const moduleName = 'services/feesAndPaymentsService';

const feesAndPaymentService = require(moduleName);
const { sinon, expect } = require('@hmcts/one-per-page-test-suite');

describe(moduleName, () => {
  beforeEach(() => {
    sinon.stub(request, 'get');
  });

  afterEach(() => {
    request.get.restore();
  });

  it('should call the fee and payments service', done => {
    const exampleCosResponse = { amount: '95' };
    request.get.resolves(exampleCosResponse);
    feesAndPaymentService.getFee('amend-fee')
      .then(response => {
        expect(request.get.calledOnce).to.eql(true);
        expect(response).to.eql('95');
      })
      .then(done, done);
  });
});