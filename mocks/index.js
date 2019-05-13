const http = require('http');
const mockserver = require('mockserver');
const logger = require('services/logger').getLogger(__filename);

function startCaseOrchestrationMock() {
  // This is a file-based mock server for local development/local E2E tests
  const port = 3001;
  const mocksPath = 'mocks/services';
  http.createServer(mockserver(mocksPath, true))
    .listen(port);
  logger.infoWithReq(null, null, 'COS mock server started');
}

function startEvidenceMgmtMock() {
  const port = 4009;
  const mocksPath = 'mocks/services';
  http.createServer(mockserver(mocksPath, true))
    .listen(port);
  logger.infoWithReq(null, null, 'Evidence Mgmt mock server started');
}

startCaseOrchestrationMock();
startEvidenceMgmtMock();
