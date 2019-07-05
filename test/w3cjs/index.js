const w3cjs = require('w3cjs');
const steps = require('steps')(false);
const { sinon, custom, expect } = require('@hmcts/one-per-page-test-suite');
const resolveTemplate = require('@hmcts/one-per-page/src/middleware/resolveTemplate');
const httpStatus = require('http-status-codes');
const cosMockCase = require('mocks/services/case-orchestration/retrieve-case/mock-case');
const config = require('config');
const feesAndPaymentsService = require('services/feesAndPaymentsService');


// Ignored warnings
const excludedWarnings = [
  'The “type” attribute is unnecessary for JavaScript resources.',
  'The “banner” role is unnecessary for element “header”.',
  'The “main” role is unnecessary for element “main”.',
  'The “contentinfo” role is unnecessary for element “footer”.',
  'The “complementary” role is unnecessary for element “aside”.',
  'The “navigation” role is unnecessary for element “nav”.',
  'The first occurrence of ID “dnCosts.claimCosts” was here.',
  'Possible misuse of “aria-label”. (If you disagree with this warning, file an issue report or send e-mail to www-validator@w3.org.)', // eslint-disable-line max-len
  'The “button” role is unnecessary for element “button”.',
  'The “button” role is unnecessary for element “input” whose type is “submit”.'
];
const filteredWarnings = r => {
  return !excludedWarnings.includes(r.message);
};

/* eslint-disable */
// FIXME - Ignored errors (temporarily)
const excludeErrors = [
  'Attribute “pattern” is only allowed when the input type is “email”, “password”, “search”, “tel”, “text”, or “url”.',
  'Element “h2” not allowed as child of element “legend” in this context. (Suppressing further errors from this subtree.)',
  "Duplicate ID “dnCosts.claimCosts”.",
  'Attribute “src” not allowed on element “image” at this point.',
  'Element “image” is missing required attribute “height”.',
  'Element “image” is missing required attribute “width”.'
];
/* eslint-enable */
const filteredErrors = r => {
  return !excludeErrors.includes(r.message);
};

// ensure step has a template - if it doesnt no need to test it
const filterSteps = step => {
  const stepInstance = new step({ journey: {} });
  const notMockStep = Object.values(config.paths).includes(step.path);
  return stepInstance.middleware.includes(resolveTemplate) && notMockStep;
};

const userDetails = {
  id: 'idamUserId',
  email: 'user@email.com'
};

const stepHtml = step => {
  return custom(step)
    .withSession(Object.assign({ entryPoint: step.name }, { case: cosMockCase }))
    .withCookie('mockIdamUserDetails', JSON.stringify(userDetails))
    .get()
    .expect(httpStatus.OK)
    .text(html => html);
};

const w3cjsValidate = html => {
  return new Promise((resolve, reject) => {
    w3cjs.validate({
      input: html,
      callback: (error, res) => { // eslint-disable-line id-blacklist
        if (error) {
          return reject(error);
        }

        const errors = res.messages
          .filter(r => r.type === 'error')
          .filter(filteredErrors);
        const warnings = res.messages
          .filter(r => r.type === 'info')
          .filter(filteredWarnings);
        return resolve({ errors, warnings });
      }
    });
  });
};

steps
  .filter(filterSteps)
  .forEach(step => {
    describe(`Validate html for the page ${step.name}`, () => {
      let errors = [];
      let warnings = [];

      before(() => {
        sinon.stub(feesAndPaymentsService, 'getFee')
          .resolves({
            feeCode: 'FEE0002',
            version: 4,
            amount: 550.00,
            description: 'Filing an application for a divorce, nullity or civil partnership dissolution – fees order 1.2.' // eslint-disable-line max-len
          });

        return stepHtml(step)
          .then(html => w3cjsValidate(html))
          .then(results => {
            errors = results.errors;
            warnings = results.warnings;
          })
          .catch(error => {
            expect(error).to.eql(false, `Error with WC3 module: ${error}`);
          });
      });

      after(() => {
        feesAndPaymentsService.getFee.restore();
      });

      it('should not have any html errors', () => {
        expect(errors.length).to.equal(0, JSON.stringify(errors, null, 2));
      });

      it('should not have any html warnings', () => {
        expect(warnings.length).to.equal(0, JSON.stringify(warnings, null, 2));
      });
    });
  });
