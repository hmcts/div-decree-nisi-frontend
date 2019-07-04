const steps = require('steps')();
const resolveTemplate = require('@hmcts/one-per-page/src/middleware/resolveTemplate');
const { expect } = require('@hmcts/one-per-page-test-suite');
const config = require('config');

// ensure step has a template - if it doesnt no need to test it
const filterSteps = step => {
  const stepInstance = new step({ journey: {} });
  const notMockStep = Object.values(config.paths).includes(step.path);
  return stepInstance.middleware.includes(resolveTemplate) && notMockStep;
};

class JSWait extends codecept_helper { // eslint-disable-line camelcase
  _beforeStep(step) {
    const helper = this.helpers.WebDriverIO || this.helpers.Puppeteer;

    // Wait for content to load before checking URL
    if (step.name === 'seeCurrentUrlEquals' || step.name === 'seeInCurrentUrl') {
      return helper.waitForElement('body', 15);
    }
    return Promise.resolve();
  }

  async navByClick(text, locator) {
    const helper = this.helpers.WebDriverIO || this.helpers.Puppeteer;
    const helperIsPuppeteer = this.helpers.Puppeteer;

    helper.click(text, locator);

    if (helperIsPuppeteer) {
      await helper.page.waitForNavigation({ waitUntil: 'networkidle0' });
    }

    await helper.wait(3);
  }

  async amOnLoadedPage(url) {
    this.urlsTested = this.urlsTested || [];
    if (!this.urlsTested.includes(url)) {
      this.urlsTested.push(url);
    }

    const helper = this.helpers.WebDriverIO || this.helpers.Puppeteer;
    const helperIsPuppeteer = this.helpers.Puppeteer;
    let newUrl = url;

    if (helperIsPuppeteer) {
      if (newUrl.indexOf('http') !== 0) {
        newUrl = helper.options.url + newUrl;
      }

      helper.page.goto(newUrl);
      await helper.page.waitForNavigation({ waitUntil: 'networkidle0' });
    } else {
      await helper.amOnPage(newUrl);
      await helper.waitInUrl(newUrl);
      await helper.waitForElement('body', 15);
    }
  }

  checkUrlsNotTested() {
    const missedPages = [];
    steps
      .filter(filterSteps)
      .forEach(step => {
        if (!this.urlsTested.includes(step.path)) {
          missedPages.push(step.path);
        }
      });

    return expect(missedPages, `Urls not tested: ${missedPages.join(', ')}`).to.eql([]);
  }
}

module.exports = JSWait;
