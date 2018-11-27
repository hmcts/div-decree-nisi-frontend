const { expect, sinon } = require('@hmcts/one-per-page-test-suite');

const modulePath = 'middleware/redirectToEntry';

const redirectToEntry = require(modulePath);

describe(modulePath, () => {
  let req = {};
  let res = {};
  let next = {};

  beforeEach(() => {
    req = {
      cookies: {}
    };

    res = {
      redirect: sinon.stub()
    };

    next = sinon.stub();
  });

  it('should redirect to root when no session cookie', () => {
    redirectToEntry.redirectToEntryIfNoSession(req, res, next);

    expect(res.redirect.calledWith('/entry')).to.equal(true);
    expect(next.calledOnce).to.equal(false);
  });

  it('should call next when session cookie exists', () => {
    req.cookies.session = 'available';

    redirectToEntry.redirectToEntryIfNoSession(req, res, next);

    expect(res.redirect.calledWith('/entry')).to.equal(false);
    expect(next.calledOnce).to.equal(true);
  });
});