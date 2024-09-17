// eslint-disable-file complexity
const config = require('config');
const superagent = require('superagent');
const httpStatus = require('http-status-codes');
const logger = require('services/logger').getLogger(__filename);
const errors = require('resources/errors');
const fileManagment = require('services/fileManagement');

const evidenceManagementClientUploadUrl = `${config.services.evidenceManagementClient.url}/${config.services.evidenceManagementClient.uploadEndpoint}`;
const defaultEMCErrorMessage = 'Error uploading to evidence management client';

const handleResponse = (req, body, resolve, reject) => {
  let error = body.error && body.error.length ? body.error : null;

  if (Array.isArray(body) && body[0].error) {
    error = body[0].error;
  }

  if (error) {
    logger.errorWithReq(req, 'evidence_upload_error',
      'Error when uploading to Evidence Management:',
      error.message
    );
    return reject(error);
  }

  const dataIsNotValid = !Array.isArray(body) || !body[0].status || body[0].status !== 'OK';
  if (dataIsNotValid) {
    logger.errorWithReq(req, 'evidence_upload_not_valid',
      'Evidence management data not valid',
      body[0].status
    );
    return reject(Array.isArray(body) ? body[0] : body);
  }

  logger.infoWithReq(req, 'evidence_uploaded',
    'Uploaded files to Evidence Management Client',
    body[0].fileUrl,
    body[0].mimeType
  );

  return resolve(body);
};

const sendFile = req => {
  const token = req.cookies['__auth-token'];

  return fileManagment.saveFileFromRequest(req)
    .then(file => {
      return new Promise((resolve, reject) => {
        superagent
          .post(evidenceManagementClientUploadUrl)
          .set({ Authorization: token })
          .set('enctype', 'multipart/form-data')
          .attach('file', file.path, file.name)
          .end((error, response = { statusCode: null }) => {
            fileManagment.removeFile(req, file);

            if (error || response.statusCode !== httpStatus.OK) {
              const errorToReturn = new Error(error || response.body || defaultEMCErrorMessage);
              errorToReturn.status = response.statusCode;

              logger.errorWithReq(req, 'evidence_error_response',
                'Error when uploading to Evidence Management',
                errorToReturn
              );

              if (response && response.errorCode === 'invalidFileType') {
                return reject(errors.fileTypeInvalid);
              }
              return reject(errorToReturn);
            }

            logger.infoWithReq(req, 'evidence_saved',
              'Saved file in Evidence Management Client'
            );

            return handleResponse(req, response.body, resolve, reject);
          });
      });
    });
};

module.exports = {
  sendFile,
  handleResponse
};
