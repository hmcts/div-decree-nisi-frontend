const config = require('config');
const idam = require('services/idam');
const { initDocumentHandler } = require('@hmcts/div-document-express-handler');

const downloadDocumentEndpoint = '/documents';

const documentWhiteList = config.document.documentWhiteList;

const bind = app => {
  const middleware = [ idam.protect() ];
  const args = {
    documentServiceUrl: `${config.services.evidenceManagementClient.url}${downloadDocumentEndpoint}`,
    sessionFileCollectionsPaths: ['case.data.d8'],
    documentNamePath: config.document.documentNamePath,
    documentWhiteList
  };
  initDocumentHandler(app, middleware, args);
};

module.exports = { bind, documentWhiteList };