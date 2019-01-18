const request = require('request-promise-native');

const moduleName = 'services/feesAndPaymentsService';

const config = require('config');
const feesAndPaymentService = require(moduleName);
const { sinon, expect } = require('@hmcts/one-per-page-test-suite');

const feeCodeEndpoint = '/fees-and-payments/version/1/';

const feeTypes = {
  issueFee: 'petition-issue-fee'
};

describe(moduleName, () => {
  beforeEach(() => {
    sinon.stub(request, 'get');
  });

  afterEach(() => {
    request.get.restore();
  });

  it('should call the fee and payments service', done => {
    const sampleFeeResponse = { amount: '95' };
    request.get.resolves(sampleFeeResponse);
    const uri = `${config.services.feesAndPayments.url}${feeCodeEndpoint}${feeTypes.issueFee}`;
    feesAndPaymentService.getFee(feeTypes.issueFee)
      .then(response => {
        expect(request.get.calledOnce).to.eql(true);
        sinon.assert.calledWith(request.get, { uri, json: true });
        expect(response).to.eql(sampleFeeResponse);
      })
      .then(done, done);
  });
});