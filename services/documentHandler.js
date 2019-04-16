const config = require('config');
const idam = require('services/idam');
const { initDocumentHandler } = require('@hmcts/div-document-express-handler');

const documentWhiteList = config.document.documentWhiteList;

const bind = app => {
  const middleware = [ idam.protect() ];
  const args = {
    documentServiceUrl: `${config.services.evidenceManagementClient.url}${config.services.evidenceManagementClient.downloadEndpoint}`,
    sessionFileCollectionsPaths: [config.document.sessionPath],
    documentNamePath: config.document.documentNamePath,
    documentWhiteList
  };
  initDocumentHandler(app, middleware, args);
};

module.exports = { bind, documentWhiteList };