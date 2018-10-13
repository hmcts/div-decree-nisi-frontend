/* eslint-disable no-process-env, func-names */

const event = require('codeceptjs').event;
const container = require('codeceptjs').container;
const exec = require('child_process').exec;
const config = require('config');

const user = process.env.SAUCE_USERNAME || config.services.saucelabs.username;
const key = process.env.SAUCE_ACCESS_KEY || config.services.saucelabs.key;


function updateSauceLabsResult(result, sessionId) {
  const parameters = `-X PUT -s -d '{"passed": ${result}}' -u ${user}:${key}`;
  const url = `https://saucelabs.com/rest/v1/${user}/jobs/${sessionId}`;
  return `curl ${parameters} ${url}`;
}

module.exports = function() {
  // Setting test success on SauceLabs
  event.dispatcher.on(event.test.passed, () => {
    const sessionId = container.helpers('WebDriverIO').browser.requestHandler.sessionID;
    exec(updateSauceLabsResult('true', sessionId));
  });

  // Setting test failure on SauceLabs
  event.dispatcher.on(event.test.failed, () => {
    const sessionId = container.helpers('WebDriverIO').browser.requestHandler.sessionID;
    exec(updateSauceLabsResult('false', sessionId));
  });
};