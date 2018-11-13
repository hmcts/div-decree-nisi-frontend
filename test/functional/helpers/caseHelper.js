const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);
const config = require('config');
const idamConfigHelper = require('./idamConfigHelper');
const caseConfigHelper = require('./caseConfigHelper');
const divTestHarness = require('@hmcts/div-test-harness');

let Helper = codecept_helper; // eslint-disable-line

const mocksPath = 'resources';

class CaseHelper extends Helper {
  createDnCaseForUser(caseDataName) {
    const params = {
      baseUrl: 'http://localhost:300',
      authToken: '',
      caseDataFilePath: 'test/test.json'
    }
    
    return divTestHarness.createDnCase()
      .then(createCaseResponse => {
        logger.info(`Created case ${createCaseResponse.id} for ${idamConfigHelper.getTestEmail()}`);
        caseConfigHelper.setTestCaseId(createCaseResponse.id);
      })
      .catch(error => {
        logger.info(`Error creating case: ${util.inspect(error)}`);
      });
  }

  // TO DO - move this to a separate node module to be shared by other FE apps
  _createCaseForUser(userToken, caseData, proxy) {
    const uri = `${config.services.caseMaintenance.baseUrl}/casemaintenance/version/1/submit`;
    const headers = {
      Authorization: `Bearer ${userToken}`,
      'Content-Type': 'application/json'
    };

    const options = {
      uri,
      headers,
      body: caseData,
      json: true
    };

    if (proxy) {
      Object.assign(options, this._setupProxy(proxy));
    }
    return request.post(options);
  }

  _updateCase(userToken, caseId, eventId, proxy) {
    logger.info(`Issuing event ${eventId} against case ${caseId}.`);
    const baseUrl = config.services.caseMaintenance.baseUrl;
    const uri = `${baseUrl}/casemaintenance/version/1/updateCase/${caseId}/${eventId}`;
    const headers = {
      Authorization: `Bearer ${userToken}`,
      'Content-Type': 'application/json'
    };

    const options = {
      uri,
      headers,
      body: {},
      json: true
    };

    if (proxy) {
      Object.assign(options, this._setupProxy(proxy));
    }
    return request.post(options);
  }

  _setupProxy(proxy) {
    const proxyUrl = url.parse(proxy);

    let proxyOptions = {};

    if (proxyUrl.protocol.indexOf('socks') >= 0) {
      proxyOptions = {
        strictSSL: false,
        agentClass: socksAgent,
        socksHost: proxyUrl.hostname || 'localhost',
        socksPort: proxyUrl.port || 9000
      };
    } else {
      proxyOptions = { proxy: proxyUrl.href };
    }

    return proxyOptions;
  }

  _readFile(fileName, type) {
    return new Promise(((resolve, reject) => {
      fs.readFile(fileName, type, (error, content) => {
        error ? reject(error) : resolve(content);
      });
    }));
  }
}

module.exports = CaseHelper;
