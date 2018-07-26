const config = require('config');

const args = {
  idamApiUrl: config.services.idam.apiUrl,
  accountsEndpoint: config.tests.e2e.idam.idamTestSupportCreateAccountEndpoint,
  testForename: config.tests.e2e.idam.idamTestForename,
  testSurname: config.tests.e2e.idam.idamTestSurname,
  testUserGroup: config.tests.e2e.idam.idamTestUserGroup,
  testLevelOfAccess: config.tests.e2e.idam.idamTestLevelOfAccess
};

let testEmail = '';
let testPassword = '';

const getArgs = () => {
  return args;
};

const setTestEmail = email => {
  testEmail = email;
};

const setTestPassword = password => {
  testPassword = password;
};

const getTestEmail = () => {
  return config.tests.e2e.idam.idamTestUsername || testEmail; // eslint-disable-line
};

const getTestPassword = () => {
  return config.tests.e2e.idam.idamTestPassword || testPassword; // eslint-disable-line
};

module.exports = { getArgs, setTestEmail, setTestPassword, getTestEmail, getTestPassword };
