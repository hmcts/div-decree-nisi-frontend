const { expect, sinon } = require('@hmcts/one-per-page-test-suite');
const config = require('config');

const modulePath = 'middleware/redirectMiddleware';

const redirectMiddleware = require(modulePath);

const authTokenString = '__auth-token';
const petitionerFrontend = config.services.petitionerFrontend;
const queryString = `?${authTokenString}=authToken`;
const expectedUrl = `${petitionerFrontend.url}${petitionerFrontend.landing}${queryString}`;

describe(modulePath, () => {
  let req = {}, res = {}, next = {};

  beforeEach(() => {
    req = {
      session: { case: {} },
      cookies: { '__auth-token': 'authToken' }
    };
    res = {
      redirect: sinon.stub()
    };
    next = sinon.stub();
  });

  it('should call redirect and set the auth header when there is no state', () => {
    redirectMiddleware.redirectOnCondition(req, res, next);

    expect(next.calledOnce).to.eql(false);
    expect(res.redirect.calledWith(expectedUrl)).to.eql(true);
  });

  it('should call next when there is no session', () => {
    delete req.session;

    redirectMiddleware.redirectOnCondition(req, res, next);

    expect(next.calledOnce).to.eql(true);
  });

  it('should call redirect and set the auth header when the state is AwaitingPayment', () => {
    req.session.case.state = 'AwaitingPayment';

    redirectMiddleware.redirectOnCondition(req, res, next);

    expect(next.calledOnce).to.eql(false);
    expect(res.redirect.calledWith(expectedUrl)).to.eql(true);
  });

  it('should call next if the state is not AwaitingPayment', () => {
    req.session.case.state = 'AwaitingDecreeNisi';

    redirectMiddleware.redirectOnCondition(req, res, next);

    expect(next.calledOnce).to.eql(true);
  });
});