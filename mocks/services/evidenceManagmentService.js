const fileManagment = require('services/fileManagement');
const errors = require('resources/errors');
const evidenceManagmentService = require('services/evidenceManagmentService');

const getResponse = file => {
  const response = {
    fileName: file.name,
    fileUrl: file.path
  };
  switch (file.name) {
  case 'filesize_error.png':
    response.error = errors.fileSizeTooLarge;
    response.status = 'ERROR';
    break;
  case 'filetype_error.png':
    response.error = errors.fileTypeInvalid;
    response.status = 'ERROR';
    break;
  case 'unkown_error.png':
    response.error = errors.unknown;
    response.status = 'ERROR';
    break;
  case 'virus_error.png':
    response.error = errors.virusFoundInFile;
    response.status = 'ERROR';
    break;
  case 'ok.png':
  default:
    response.status = 'OK';
  }

  return [response];
};

const delayTime = 1000;
const delayRequest = file => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(file);
    }, delayTime);
  });
};

const sendFile = req => {
  return fileManagment.saveFileFromRequest(req)
    .then(delayRequest)
    .then(getResponse)
    .then(resp => {
      return new Promise((resolve, reject) => {
        evidenceManagmentService
          .handleResponse(req, resp, resolve, reject);
      });
    });
};

module.exports = { sendFile };
