const modulePath = 'services/logger';

const { sinon } = require('@hmcts/one-per-page-test-suite');
const nodeJsLogger = require('@hmcts/nodejs-logging').Logger.getLogger('name');
const logger = require(modulePath);
const urlSanitiser = require('helpers/sanitiseUrlHelper');

const req = {
  originalUrl: 'url',
  method: 'POST',
  httpVersionMajor: '1',
  httpVersionMinor: '1',
  idam: { userDetails: { id: 'idam-id' } },
  session: { case: { caseId: 'case-id' } }
};

describe(modulePath, () => {
  describe('#accessLogger', () => {
    it('returns access logger middleware that is executable', () => {
      const middleware = logger.accessLogger();
      const res = {
        statusCode: 200,
        end: sinon.stub()
      };
      middleware(req, res, sinon.stub());
      res.end();
    });

    it('sanitises an empty url@testone', () => {
      const actualUrl = '';
      const expectedUrl = '';
      const sanitisedUrl = urlSanitiser.sanitiseUrl(actualUrl);
      sinon.assert.match(
        sanitisedUrl,
        expectedUrl
      );
    });

    it('sanitises a url with one parameter@testone', () => {
      const actualUrl = '/authenticated?__auth-token=thEt0keN';
      const expectedUrl = '/authenticated?';
      const sanitisedUrl = urlSanitiser.sanitiseUrl(actualUrl);
      sinon.assert.match(
        sanitisedUrl,
        expectedUrl
      );
    });

    it('sanitises a url with two parameters@testone', () => {
      const actualUrl = '/authenticated?__auth-token=thEt0keN&code=01928askljqw8913041&parameter=value';
      const expectedUrl = '/authenticated?__parameter=value';
      const sanitisedUrl = urlSanitiser.sanitiseUrl(actualUrl);
      sinon.assert.match(
        sanitisedUrl,
        expectedUrl
      );
    });
  });

  describe('#getLogger', () => {
    const tag = 'tag';
    const message = 'message';
    const someArg = {};

    beforeEach(() => {
      sinon.stub(nodeJsLogger, 'info');
      sinon.stub(nodeJsLogger, 'warn');
      sinon.stub(nodeJsLogger, 'error');
    });

    afterEach(() => {
      nodeJsLogger.info.restore();
      nodeJsLogger.warn.restore();
      nodeJsLogger.error.restore();
    });

    it('calls logger.info', () => {
      const getLogger = logger.getLogger('name');

      getLogger.infoWithReq(req, tag, message, someArg);

      sinon.assert.calledWith(
        nodeJsLogger.info,
        `IDAM ID: ${req.idam.userDetails.id}, CASE ID: ${req.session.case.caseId}`,
        tag,
        message,
        someArg
      );
    });

    it('calls logger.warn', () => {
      const getLogger = logger.getLogger('name');

      getLogger.warnWithReq(req, tag, message, someArg);

      sinon.assert.calledWith(
        nodeJsLogger.warn,
        `IDAM ID: ${req.idam.userDetails.id}, CASE ID: ${req.session.case.caseId}`,
        tag,
        message,
        someArg
      );
    });

    it('calls logger.error', () => {
      const getLogger = logger.getLogger('name');

      getLogger.errorWithReq(req, tag, message, someArg);

      sinon.assert.calledWith(
        nodeJsLogger.error,
        `IDAM ID: ${req.idam.userDetails.id}, CASE ID: ${req.session.case.caseId}`,
        tag,
        message,
        someArg
      );
    });
  });
});
