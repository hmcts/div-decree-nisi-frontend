const modulePath = 'middleware/feesAndPaymentsMiddleware';
const { sinon, expect } = require('@hmcts/one-per-page-test-suite');
const {
  getFeeFromFeesAndPayments,
  feeTypes
} = require(modulePath);
const feesAndPaymentsService = require('services/feesAndPaymentsService');

const appFee = (feeType, amount) => {
  return {
    feeCode: feeType,
    version: 4,
    amount,
    description: 'Filing an application for a divorce, nullity or civil partnership dissolution – fees order 1.2.' // eslint-disable-line max-len
  };
};

describe(modulePath, () => {
  afterEach(() => {
    feesAndPaymentsService.getFee.restore();
  });

  it('gets the application fee from the service', done => {
    const next = sinon.stub();
    const res = {
      locals: { applicationFee: {} }
    };
    const req = sinon.stub();

    sinon.stub(feesAndPaymentsService, 'getFee').withArgs(feeTypes.issueFee)
      .resolves(appFee(feeTypes.issueFee, '550'));

    getFeeFromFeesAndPayments(feeTypes.issueFee)(req, res, next).then(() => {
      expect(res.locals.applicationFee[feeTypes.issueFee]).to.eql('550');
      expect(next.calledOnce).to.eql(true);
      done();
    }).catch(error => {
      done(error);
    });
  });

  it('calls next on error', done => {
    const next = sinon.stub();
    const res = {
      locals: { }
    };
    const req = sinon.stub();

    sinon.stub(feesAndPaymentsService, 'getFee')
      .rejects({});

    getFeeFromFeesAndPayments(feeTypes.issueFee)(req, res, next)
      .then(() => {
        expect(next.calledOnce).to.eql(true);
        done();
      }).catch(error => {
        done(error);
      });
  });
});
