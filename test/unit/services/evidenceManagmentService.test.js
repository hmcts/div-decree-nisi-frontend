const modulePath = 'services/evidenceManagmentService';

const { expect, sinon } = require('@hmcts/one-per-page-test-suite');
const superagent = require('superagent');
const httpStatus = require('http-status-codes');
const errors = require('resources/errors');
const fileManagement = require('services/fileManagement');
const evidenceManagmentService = require(modulePath);

describe(modulePath, () => {
  describe('#handleResponse', () => {
    let body = {};

    beforeEach(() => {
      body = [{ status: 'OK' }];
    });

    it('resolves with body if valid', done => {
      evidenceManagmentService.handleResponse(body)
        .then(response => {
          expect(response).to.eql(body);
        })
        .then(done, done);
    });

    it('rejects with body if valid', () => {
      body = [{ status: 'BAD' }];
      return expect(evidenceManagmentService.handleResponse(body))
        .to.eventually.be.rejected;
    });

    it('rejects with body if contains error', () => {
      body = { error: 'true' };

      return expect(evidenceManagmentService.handleResponse(body))
        .to.eventually.be.rejected;
    });
  });

  describe('#sendFile', () => {
    const b = 0x62;
    const buf = Buffer.from([b, b, b]);
    const superagentStub = {};
    let resp = {};
    let req = {};
    let file = '';

    beforeEach(() => {
      req = { cookies: [] };
      resp = {
        statusCode: httpStatus.OK,
        body: [{ status: 'OK' }]
      };
      file = 'some file';
      superagentStub.set = sinon.stub().returns(superagentStub);
      superagentStub.attach = sinon.stub().returns(superagentStub);
      superagentStub.end = callBack => {
        return callBack(null, resp);
      };
      sinon.stub(superagent, 'post').returns(superagentStub);
      sinon.stub(fileManagement, 'removeFile');
      sinon.stub(fileManagement, 'saveFileFromRequest').resolves(file);

      // config.evidenceManagmentClient.url = 'test';
    });

    afterEach(() => {
      // delete config.evidenceManagmentClient.url;
      superagent.post.restore();
      fileManagement.removeFile.restore();
      fileManagement.saveFileFromRequest.restore();
    });

    it('posts file to successfully', done => {
      evidenceManagmentService.sendFile(req)
        .then(() => {
          expect(fileManagement.removeFile.calledOnce).to.equal(true);
          expect(fileManagement.removeFile.calledWith(file)).to.equal(true);
          expect(superagent.post.calledOnce).to.equal(true);
          expect(superagentStub.set.called).to.equal(true);
          expect(superagentStub.attach.calledOnce).to.equal(true);
        })
        .then(done, done);
    });

    it('rejects if returned status is not 200', () => {
      resp = {
        statusCode: httpStatus.BAD_REQUEST,
        body: 'BAD_REQUEST'
      };
      fileManagement.saveFileFromRequest.resolves(buf);

      expect(evidenceManagmentService.sendFile(req))
        .to.be.rejectedWith(resp.body);
    });

    it('returns fileTypeInvalid error if file is rejected with type', done => {
      resp = {
        statusCode: httpStatus.BAD_REQUEST,
        errorCode: 'invalidFileType'
      };
      fileManagement.saveFileFromRequest.resolves(buf);

      expect(evidenceManagmentService.sendFile(req))
        .to.be.rejectedWith(errors.fileTypeInvalid)
        .and.notify(done);
    });
  });
});
