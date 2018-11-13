const http = require('http');
const mockserver = require('mockserver');

function startCaseOrchestrationMock() {
  // This is a file-based mock server for local development/local E2E tests
  const port = 4001;
  const mocksPath = 'mocks/services/case-orchestration';
  http.createServer(mockserver(mocksPath, true))
    .listen(port);
}

startCaseOrchestrationMock();
