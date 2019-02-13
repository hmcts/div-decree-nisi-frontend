const config = require('config');
const { expect, sinon } = require('@hmcts/one-per-page-test-suite');

const authTokenString = '__auth-token';

const modulePath = 'helpers/redirectToFrontendHelper';

const { redirectToFrontend, redirectToAos, redirectToFrontendAmend } = require(modulePath);

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

  it('should redirect to petitioner frontend on call', () => {
    const petitionerFrontend = config.services.petitionerFrontend;
    const landingUrl = `${petitionerFrontend.url}${petitionerFrontend.landing}`;
    const expectedUrl = `${landingUrl}?${authTokenString}=someValue`;

    redirectToFrontend(req, res);

    expect(res.redirect.calledWith(expectedUrl)).to.equal(true);
  });

  it('should redirect to Petitioner Frontend to amend application', () => {
    const petitionerFrontend = config.services.petitionerFrontend;
    // eslint-disable-next-line
    const landingUrl = `${petitionerFrontend.url}${petitionerFrontend.landing}?toNextUnansweredPage=true&${authTokenString}=${req.cookies[authTokenString]}`;
    const expectedUrl = `${landingUrl}`;

    redirectToFrontendAmend(req, res);

    expect(res.redirect.calledWith(expectedUrl)).to.equal(true);
  });

  it('should redirect to AOS on call', () => {
    const aosFrontend = config.services.aosFrontend;
    const landingUrl = `${aosFrontend.url}${aosFrontend.landing}`;
    const expectedUrl = `${landingUrl}?${authTokenString}=someValue`;

    redirectToAos(req, res);

    expect(res.redirect.calledWith(expectedUrl)).to.equal(true);
  });
});
