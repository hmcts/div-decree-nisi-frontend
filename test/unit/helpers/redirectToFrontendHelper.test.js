const config = require('config');
const { expect, sinon } = require('@hmcts/one-per-page-test-suite');

const authTokenString = '__auth-token';

const modulePath = 'helpers/redirectToFrontendHelper';

const redirectToFrontend = require(modulePath);

describe(modulePath, () => {
  let req = {};
  let res = {};

  beforeEach(() => {
    req = {
      cookies: {
        '__auth-token': 'someValue'
      }
    };

    res = {
      redirect: sinon.stub()
    };
  });

  it('should redirect to frontend on call', () => {
    const petitionerFrontend = config.services.petitionerFrontend;
    const landingUrl = `${petitionerFrontend.url}${petitionerFrontend.landing}`;
    const expectedUrl = `${landingUrl}?${authTokenString}=someValue`;

    redirectToFrontend(req, res);

    expect(res.redirect.calledWith(expectedUrl)).to.equal(true);
  });
});