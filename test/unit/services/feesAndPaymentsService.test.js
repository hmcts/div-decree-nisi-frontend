const request = require('request-promise-native');

const moduleName = 'services/feesAndPaymentsService';

const feesAndPaymentService = require(moduleName);
const { sinon, expect } = require('@hmcts/one-per-page-test-suite');

describe(moduleName, () => {
  beforeEach(() => {
    sinon.stub(request, 'getFee');
  });

  afterEach(() => {
    request.getFee.restore();
  });

  it('should call the fee and payments service', done => {
    feesAndPaymentService.getFee({})
      .then(() => {
        expect(request.getFee.calledOnce).to.eql(true);
      })
      .then(done, done);
  });
});