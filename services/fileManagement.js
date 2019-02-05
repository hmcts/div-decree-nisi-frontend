const fs = require('fs');
const util = require('util');
const logger = require('services/logger').getLogger(__filename);
const formidable = require('formidable');

const saveFileFromRequest = (req = {}) => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (error, fields, files) => {
      if (error) {
        logger.errorWithReq(req, 'parse_error',
          'Unable to parse request',
          error.message
        );
        return reject(error);
      }
      req.body = fields;
      logger.infoWithReq(req, 'parse_success',
        'File parsed successfully'
      );
      return resolve(files.file);
    });
  });
};

const removeFile = (req, file) => {
  const unlink = util.promisify(fs.unlink);
  return unlink(file.path)
    .catch(error => {
      logger.errorWithReq(req, 'file_remove_error',
        'Unable to remove file',
        error.message
      );
      throw error;
    });
};

module.exports = {
  saveFileFromRequest,
  removeFile
};
