const modulePath = 'services/logger';

const { sinon } = require('@hmcts/one-per-page-test-suite');
const nodeJsLogger = require('@hmcts/nodejs-logging').Logger.getLogger('name');
const nodeJsLog = require('@hmcts/nodejs-logging').Express;
const logger = require(modulePath);

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
    beforeEach(() => {
      sinon.stub(nodeJsLog, 'accessLogger');
    });

    afterEach(() => {
      nodeJsLog.accessLogger.restore();
    });

    it('returns access logger middleware that is executable', () => {
      const middleware = logger.accessLogger();
      const res = {
        statusCode: 200,
        end: sinon.stub()
      };
      middleware(req, res, sinon.stub());
      res.end();
    });

    it('removes idam authentication token @testone', () => {
      // const getLogger = logger.getLogger('name');
      // const middleware = logger.accessLogger();
      const actualUrl = '/authenticated?__auth-token=thEt0keN';
      const expectedUrl = '/authenticated?';
      const reqNew = req;
      reqNew.originalUrl = actualUrl;
      const res = {
        statusCode: 200,
        end: sinon.stub()
      };
      // middleware(req, res, sinon.stub());
      // res.end();
      // getLogger.errorWithReq(reqNew, tag, message, someArg);

      sinon.assert.calledWith(
        nodeJsLog.accessLogger,
        `IDAM ID: idam.userDetails.id, CASE ID: unknown -
        "${reqNew.method} ${expectedUrl} HTTP/${reqNew.httpVersionMajor}.${reqNew.httpVersionMinor}" ${res.statusCode}`
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
