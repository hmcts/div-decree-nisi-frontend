const modulePath = 'mocks/services/evidenceManagmentService';

const { expect, sinon } = require('@hmcts/one-per-page-test-suite');
const errors = require('resources/errors');
const fileManagement = require('services/fileManagement');
const evidenceManagmentServiceMock = require(modulePath);

describe(modulePath, () => {
  const req = {};

  beforeEach(() => {
    sinon.stub(fileManagement, 'removeFile');
    sinon.stub(fileManagement, 'saveFileFromRequest');
  });

  afterEach(() => {
    fileManagement.removeFile.restore();
    fileManagement.saveFileFromRequest.restore();
  });

  describe('#sendFile', () => {
    it('resolves with body if valid', done => {
      const file = { name: 'ok.png' };
      fileManagement.saveFileFromRequest.resolves(file);

      evidenceManagmentServiceMock
        .sendFile(req)
        .then(response => {
          expect(response.length).to.eql(1);
          expect(response[0].status).to.eql('OK');
        })
        .then(done, done);
    });

    it('resolves with error about filesize', done => {
      const file = { name: 'filesize_error.png' };
      fileManagement.saveFileFromRequest.resolves(file);

      expect(evidenceManagmentServiceMock.sendFile(req))
        .to.be.rejectedWith(errors.errorFileSizeTooLarge)
        .and.notify(done);
    });

    it('resolves with error about filetype', done => {
      const file = { name: 'filetype_error.png' };
      fileManagement.saveFileFromRequest.resolves(file);

      expect(evidenceManagmentServiceMock.sendFile(req))
        .to.be.rejectedWith(errors.fileTypeInvalid)
        .and.notify(done);
    });

    it('resolves with unkown error', done => {
      const file = { name: 'unkown_error.png' };
      fileManagement.saveFileFromRequest.resolves(file);

      expect(evidenceManagmentServiceMock.sendFile(req))
        .to.be.rejectedWith(errors.unknown)
        .and.notify(done);
    });

    it('resolves with error about virus', done => {
      const file = { name: 'virus_error.png' };
      fileManagement.saveFileFromRequest.resolves(file);

      expect(evidenceManagmentServiceMock.sendFile(req))
        .to.be.rejectedWith(errors.virusFoundInFile)
        .and.notify(done);
    });
  });
});
