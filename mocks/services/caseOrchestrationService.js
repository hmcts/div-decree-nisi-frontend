const getSessionResponse = require('mocks/stubs/getSessionResponse');
const submitApplicationresponse = require('mocks/stubs/submitApplicationResponse');

const methods = {
  getApplication: () => {
    return new Promise(resolve => {
      resolve({ case: getSessionResponse });
    });
  },
  submitApplication: () => {
    return new Promise(resolve => {
      resolve(submitApplicationresponse);
    });
  }
};

module.exports = methods;
