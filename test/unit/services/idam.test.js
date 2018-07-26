const modulePath = 'services/idam';

const config = require('config');
const idamExpressMiddlewareMock = require('mocks/services/idam');
const { expect, sinon, requireNoCache } = require('@hmcts/one-per-page-test-suite');

const previousEnvironment = config.environment;

describe(modulePath, () => {
  describe('idamExpressMiddleware if environment is not development or test', () => {
    let idam = {};

    before(() => {
      config.environment = 'other env';
      idam = requireNoCache(modulePath);
    });

    after(() => {
      config.environment = previousEnvironment;
    });

    it('gets the current IdamArgs', () => {
      const idamArgs = idam.getIdamArgs();

      expect(idamArgs.hasOwnProperty('redirectUri'));
      expect(idamArgs.hasOwnProperty('indexUrl'));
      expect(idamArgs.hasOwnProperty('idamApiUrl'));
      expect(idamArgs.hasOwnProperty('idamLoginUrl'));
      expect(idamArgs.hasOwnProperty('idamSecret'));
      expect(idamArgs.hasOwnProperty('idamClientID'));
    });

    it('sets idamArgs.hostname & idamArgs.redirectUri correctly', () => {
      const host = 'newHostName:3000';
      const req = { get: sinon.stub().returns(host) };
      const next = sinon.stub();

      expect(idam.hasOwnProperty('setRedirectUri')).to.eql(true);
      idam.setRedirectUri(req, {}, next);

      const newArgs = idam.getIdamArgs();
      expect(newArgs.redirectUri).to
        .eql(`https://${req.get('host')}${config.paths.authenticated}`);
      expect(newArgs.hostName).to.eql('newHostName');
    });

    it('exports a authenticate function', () => {
      expect(idam.hasOwnProperty('authenticate')).to.eql(true);
    });

    it('exports a landingPage function', () => {
      expect(idam.hasOwnProperty('landingPage')).to.eql(true);
    });

    it('exports a protect function', () => {
      expect(idam.hasOwnProperty('protect')).to.eql(true);
    });

    it('exports a logout function', () => {
      expect(idam.hasOwnProperty('logout')).to.eql(true);
    });

    it('exports a userDetails function', () => {
      expect(idam.hasOwnProperty('userDetails')).to.eql(true);
    });
  });

  describe('mock middleware if environment is development or test', () => {
    let mockSpy = {};
    let idam = {};

    before(() => {
      config.environment = 'development';
      idam = requireNoCache(modulePath);
    });

    after(() => {
      config.environment = previousEnvironment;
    });

    afterEach(() => {
      mockSpy.restore();
    });

    it('mock authenticate', () => {
      mockSpy = sinon.spy(idamExpressMiddlewareMock, 'authenticate');

      idam.authenticate();

      sinon.assert.calledOnce(mockSpy);
    });

    it('mock landingPage', () => {
      mockSpy = sinon.spy(idamExpressMiddlewareMock, 'landingPage');

      idam.landingPage();

      sinon.assert.calledOnce(mockSpy);
    });

    it('mock protect', () => {
      mockSpy = sinon.spy(idamExpressMiddlewareMock, 'protect');

      idam.protect();

      sinon.assert.calledOnce(mockSpy);
    });

    it('mock logout', () => {
      mockSpy = sinon.spy(idamExpressMiddlewareMock, 'logout');

      idam.logout();

      sinon.assert.calledOnce(mockSpy);
    });

    it('mock userDetails', () => {
      mockSpy = sinon.spy(idamExpressMiddlewareMock, 'userDetails');

      idam.userDetails();

      sinon.assert.calledOnce(mockSpy);
    });
  });
});
