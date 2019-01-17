const request = require('request-promise-native');

const moduleName = 'services/feesAndPaymentsService';

const config = require('config');
const feesAndPaymentService = require(moduleName);
const { sinon, expect } = require('@hmcts/one-per-page-test-suite');

const feeCodeEndpoint = '/fees-and-payments/version/1/';

const feeTypes = {
  issueFee: 'petition-issue-fee',
  amendFee: 'amend-fee',
  defendPetitionFee: 'defended-petition-fee',
  generalAppFee: 'general-application-fee',
  enforcementFee: 'enforcement-fee',
  appFinancialOrderFee: 'application-financial-order-fee',
  appWithoutNoticeFee: 'application-without-notice-fee',
  getAllFees: 'get-all-fees'
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
    feesAndPaymentService.getFee('amend-fee')
      .then(response => {
        expect(request.get.calledOnce).to.eql(true);
        expect(response).to.eql('95');
      })
      .then(done, done);
  });

  it('should call the fee and payments service with issueFee param', done => {
    const sampleFeeResponse = { amount: '550' };
    request.get.resolves(sampleFeeResponse);
    const uri = `${config.services.feesAndPayments.url}${feeCodeEndpoint}${feeTypes.issueFee}`;
    feesAndPaymentService.issueFeeForApplication()
      .then(response => {
        expect(request.get.calledOnce).to.eql(true);
        sinon.assert.calledWith(request.get, { uri, json: true });
        expect(response).to.eql('550');
      })
      .then(done, done);
  });

  it('should call the fee and payments service with amendFee param', done => {
    const sampleFeeResponse = { amount: '95' };
    request.get.resolves(sampleFeeResponse);
    const uri = `${config.services.feesAndPayments.url}${feeCodeEndpoint}${feeTypes.amendFee}`;
    feesAndPaymentService.amendFee()
      .then(response => {
        expect(request.get.calledOnce).to.eql(true);
        sinon.assert.calledWith(request.get, { uri, json: true });
        expect(response).to.eql('95');
      })
      .then(done, done);
  });

  it('should call the fee and payments service with defendPetitionFee param', done => {
    const sampleFeeResponse = { amount: '50' };
    request.get.resolves(sampleFeeResponse);
    const uri = `${config.services.feesAndPayments.url}${feeCodeEndpoint}${feeTypes.defendPetitionFee}`; // eslint-disable-line max-len
    feesAndPaymentService.defendPetitionFee()
      .then(response => {
        expect(request.get.calledOnce).to.eql(true);
        sinon.assert.calledWith(request.get, { uri, json: true });
        expect(response).to.eql('50');
      })
      .then(done, done);
  });

  it('should call the fee and payments service with generalAppFee param', done => {
    const sampleFeeResponse = { amount: '50' };
    request.get.resolves(sampleFeeResponse);
    const uri = `${config.services.feesAndPayments.url}${feeCodeEndpoint}${feeTypes.generalAppFee}`; // eslint-disable-line max-len
    feesAndPaymentService.generalAppFee()
      .then(response => {
        expect(request.get.calledOnce).to.eql(true);
        sinon.assert.calledWith(request.get, { uri, json: true });
        expect(response).to.eql('50');
      })
      .then(done, done);
  });

  it('should call the fee and payments service with enforcementFee param', done => {
    const sampleFeeResponse = { amount: '110' };
    request.get.resolves(sampleFeeResponse);
    const uri = `${config.services.feesAndPayments.url}${feeCodeEndpoint}${feeTypes.enforcementFee}`; // eslint-disable-line max-len
    feesAndPaymentService.enforcementFee()
      .then(response => {
        expect(request.get.calledOnce).to.eql(true);
        sinon.assert.calledWith(request.get, { uri, json: true });
        expect(response).to.eql('110');
      })
      .then(done, done);
  });

  it('should call the fee and payments service with appFinancialOrderFee param', done => {
    const sampleFeeResponse = { amount: '255' };
    request.get.resolves(sampleFeeResponse);
    const uri = `${config.services.feesAndPayments.url}${feeCodeEndpoint}${feeTypes.appFinancialOrderFee}`; // eslint-disable-line max-len
    feesAndPaymentService.appFinancialOrderFee()
      .then(response => {
        expect(request.get.calledOnce).to.eql(true);
        sinon.assert.calledWith(request.get, { uri, json: true });
        expect(response).to.eql('255');
      })
      .then(done, done);
  });

  it('should call the fee and payments service with appWithoutNoticeFee param', done => {
    const sampleFeeResponse = { amount: '50' };
    request.get.resolves(sampleFeeResponse);
    const uri = `${config.services.feesAndPayments.url}${feeCodeEndpoint}${feeTypes.appWithoutNoticeFee}`; // eslint-disable-line max-len
    feesAndPaymentService.appWithoutNoticeFee()
      .then(response => {
        expect(request.get.calledOnce).to.eql(true);
        sinon.assert.calledWith(request.get, { uri, json: true });
        expect(response).to.eql('50');
      })
      .then(done, done);
  });
});