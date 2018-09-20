const modulePath = 'middleware/evidenceManagmentMiddleware';

const evidenceManagmentMiddleware = require(modulePath);
const { expect, sinon } = require('@hmcts/one-per-page-test-suite');
const evidenceManagmentService = require('services/evidenceManagmentService');
const evidenceManagmentServiceMock = require('mocks/services/evidenceManagmentService');
const httpStatus = require('http-status-codes');
const fileManagement = require('services/fileManagement');
const config = require('config');

let service = evidenceManagmentService;
if (['development'].includes(config.environment)) {
  service = evidenceManagmentServiceMock;
}

const nameSpace = 'test';

describe(modulePath, () => {
  describe('#createHandler', () => {
    let req = {},
      res = {},
      next = {},
      expressHandler = {};

    it('returns express handler', () => {
      expressHandler = evidenceManagmentMiddleware.createHandler(nameSpace);
      expect(typeof expressHandler).to.eql('function');
    });

    beforeEach(() => {
      next = sinon.stub();
      req = {
        cookies: '',
        method: 'get',
        session: { hydrate: sinon.stub() },
        query: {},
        headers: { 'content-type': 'multipart/form-data' },
        currentStep: { path: 'step/path' }
      };
      res = {
        redirect: sinon.stub(),
        send: sinon.stub()
      };
      res.status = sinon.stub().returns(res);
      expressHandler = evidenceManagmentMiddleware.createHandler(nameSpace);

      sinon.stub(fileManagement, 'saveFileFromRequest').resolves({});
      sinon.stub(service, 'sendFile').resolves([{ fileUrl: 'file' }]);
    });

    afterEach(() => {
      fileManagement.saveFileFromRequest.restore();
      service.sendFile.restore();
    });

    describe('orchestrates removing file', () => {
      it('with js', done => {
        req.method = 'delete';
        req.query = { js: true, fileUrl: 'file' };
        req.session[nameSpace] = {};
        req.session[nameSpace].files = [{ fileUrl: 'file' }];
        expressHandler(req, res, next)
          .then(() => {
            expect(req.session[nameSpace].files.length).to.eql(0);
            expect(res.status.calledOnce).to.eql(true);
            expect(res.send.calledOnce).to.eql(true);
          })
          .then(done, done);
      });
      it('without js', done => {
        req.method = 'delete';
        req.query = { fileUrl: 'file' };
        req.session[nameSpace] = {};
        req.session[nameSpace].files = [{ fileUrl: 'file' }];
        expressHandler(req, res, next)
          .then(() => {
            expect(req.session[nameSpace].files.length).to.eql(0);
            expect(res.redirect.calledOnce).to.eql(true);
          })
          .then(done, done);
      });
    });

    describe('orchestrates posting a file', () => {
      it('should run all functions', done => {
        req.method = 'post';
        expressHandler(req, res, next)
          .then(() => {
            expect(service.sendFile.calledOnce)
              .to.eql(true);
            expect(req.session[nameSpace].files.length).to.eql(1);
            expect(res.redirect.calledOnce).to.eql(true);
          })
          .then(done, done);
      });
      it('should return 200 if JS request', done => {
        req.method = 'post';
        req.query.js = true;
        expressHandler(req, res, next)
          .then(() => {
            expect(service.sendFile.calledOnce)
              .to.eql(true);
            expect(res.status.calledOnce).to.eql(true);
            expect(res.status.calledWith(httpStatus.OK)).to.eql(true);
            expect(res.send.calledOnce).to.eql(true);
          })
          .then(done, done);
      });
      it('should redirect if non-js request', done => {
        req.method = 'post';
        expressHandler(req, res, next)
          .then(() => {
            expect(res.redirect.calledOnce).to.eql(true);
          })
          .then(done, done);
      });
      it('should handle error', done => {
        req.method = 'post';
        req.query.js = true;
        service.sendFile.restore();
        sinon.stub(service, 'sendFile').rejects();
        expressHandler(req, res, next)
          .then(() => {
            expect(res.status.calledOnce).to.eql(true);
            expect(res.status.calledWith(
              evidenceManagmentMiddleware.errors.unknown.status
            )).to.eql(true);
            expect(res.send.calledOnce).to.eql(true);
            expect(res.send.calledWith(
              evidenceManagmentMiddleware.errors.unknown
            )).to.eql(true);
          })
          .then(done, done);
      });
      it('should return unknown error', done => {
        req.method = 'post';
        req.query.js = true;
        service.sendFile.restore();
        sinon.stub(service, 'sendFile').rejects({ status: httpStatus.INTERNAL_SERVER_ERROR });
        expressHandler(req, res, next)
          .then(() => {
            expect(res.status.calledOnce).to.eql(true);
            expect(res.status.calledWith(
              evidenceManagmentMiddleware.errors.unknown.status
            )).to.eql(true);
            expect(res.send.calledOnce).to.eql(true);
            expect(res.send.calledWith(
              evidenceManagmentMiddleware.errors.unknown
            )).to.eql(true);
          })
          .then(done, done);
      });
    });

    describe('submit', () => {
      it('should call next if submit button pressed', () => {
        req.body = { submit: true };
        expressHandler(req, res, next);
        expect(next.calledOnce).to.eql(true);
      });
    });
    describe('default', () => {
      it('should call next not delete or post or submit button pressed', () => {
        req.method = 'get';
        expressHandler(req, res, next);
        expect(next.calledOnce).to.eql(true);
      });
    });
  });

  describe('#errorHandler', () => {
    const req = {},
      res = {};
    let next = {};
    beforeEach(() => {
      req.query = {};
      req.session = { hydrate: sinon.stub() };
      req.currentStep = {
        path: 'step/path',
        name: 'stepName',
        parse: sinon.stub(),
        validate: sinon.stub(),
        storeErrors: sinon.stub()
      };
      res.redirect = sinon.stub();
      res.send = sinon.stub();
      res.status = sinon.stub().returns(res);
      next = sinon.stub();
    });
    describe('javascript', () => {
      it('should default to unknown error if we dont know it', () => {
        req.query.js = true;
        evidenceManagmentMiddleware.errorHandler({ code: 'an unknown error' }, req, res, next);
        expect(res.status.calledOnce).to.eql(true);
        expect(res.send.calledWith(evidenceManagmentMiddleware.errors.unknown))
          .to.eql(true);
      });
      it('return status code and message if js request', () => {
        req.query.js = true;
        evidenceManagmentMiddleware.errorHandler(
          evidenceManagmentMiddleware.errors.maximumFilesExceeded,
          req,
          res,
          next
        );
        expect(res.status.calledOnce).to.eql(true);
        expect(res.send.calledOnce).to.eql(true);
      });
    });
    describe('no javascript', () => {
      it('calls step standard validation and redirects to show errors', () => {
        evidenceManagmentMiddleware.errorHandler(
          evidenceManagmentMiddleware.errors.maximumFilesExceeded,
          req,
          res,
          next
        );
        expect(req.currentStep.parse.calledOnce).to.eql(true);
        expect(req.currentStep.validate.calledOnce).to.eql(true);
        expect(req.currentStep.storeErrors.calledOnce).to.eql(true);
        expect(res.redirect.calledOnce).to.eql(true);
      });
      it('should add existing files from session into body', () => {
        req.session.stepName = {
          files: [{ fileName: 'existing file' }]
        };
        evidenceManagmentMiddleware.errorHandler({ code: 'an unknown error' }, req, res, next);
        expect(req.body).to.eql({
          files: [
            { fileName: 'existing file' },
            { error: 'errorUnknown' }
          ]
        });
      });
    });
  });

  describe('#handleResponseFromFileStore', () => {
    const req = {};
    const res = {};
    const two = 2;
    beforeEach(() => {
      req.session = { hydrate: sinon.stub() };
    });
    it('should add new files if none exists', done => {
      const files = [{ name: 'file' }];
      evidenceManagmentMiddleware
        .handleResponseFromFileStore(req, res, files, nameSpace)
        .then(() => {
          expect(req.session[nameSpace].files.length).to.eql(1);
          expect(req.session[nameSpace].files[0]).to.eql(files[0]);
        })
        .then(done, done);
    });
    it('should append file to list', done => {
      const files = [{ name: 'file2' }];
      req.session[nameSpace] = { files: [{ name: 'file1' }] };
      evidenceManagmentMiddleware
        .handleResponseFromFileStore(req, res, files, nameSpace)
        .then(() => {
          expect(req.session[nameSpace].files.length).to.eql(two);
          expect(req.session[nameSpace].files[1]).to.eql(files[0]);
        })
        .then(done, done);
    });
  });

  describe('#resetAllErrors', () => {
    it('remove all errors from session', () => {
      const req = {
        session: {
          errorMaximumFilesExceeded: 'invalid',
          errorFileTypeInvalid: 'invalid'
        }
      };
      evidenceManagmentMiddleware.resetAllErrors(req);
      expect(req.session).to.eql({});
    });
  });

  describe('#validatePostRequest', () => {
    it('should return error if files are more than 10', done => {
      const req = { session: {} };
      req.session[nameSpace] = { files: [ {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {} ] };

      expect(evidenceManagmentMiddleware.validatePostRequest(req, nameSpace))
        .to.be
        .rejectedWith(evidenceManagmentMiddleware.errors.maximumFilesExceeded)
        .and.notify(done);
    });
    it('should return ok if files less than 10', done => {
      const req = { session: { hydrate: sinon.stub() } };
      req.session[nameSpace] = { files: [ {}, {} ] };

      evidenceManagmentMiddleware.validatePostRequest(req, nameSpace)
        .then(result => {
          expect(result).to.eql(req);
        })
        .then(done, done);
    });
  });

  describe('#removeFile', () => {
    const file1 = 'file uploaded 1';
    const file2 = 'file uploaded 2';

    it('removes files from session', done => {
      const req = {
        query: { fileUrl: file1 },
        session: { hydrate: sinon.stub() }
      };
      const res = {};
      req.session[nameSpace] = {
        files: [
          { fileName: file1, fileUrl: file1 },
          { fileName: file2, fileUrl: file2 }
        ]
      };
      evidenceManagmentMiddleware.removeFile(req, res, nameSpace)
        .then(() => {
          expect(req.session[nameSpace].files).to
            .eql([{ fileName: file2, fileUrl: file2 }]);
        })
        .then(done, done);
    });
  });
});
