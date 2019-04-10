const config = require('config');
const idam = require('services/idam');
const { initDocumentHandler } = require('@hmcts/div-document-express-handler');

const downloadDocumentEndpoint = '/documents';

const bind = app => {
  const middleware = [ idam.protect() ];
  const args = {
    documentServiceUrl: `${config.services.evidenceManagementClient.url}${downloadDocumentEndpoint}`,
    sessionFileCollectionsPaths: ['case.data.files']
  };
  initDocumentHandler(app, middleware, args);
};

module.exports = { bind };