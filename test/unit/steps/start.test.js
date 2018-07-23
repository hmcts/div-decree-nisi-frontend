const modulePath = 'steps/start/Start.step';

const example = require(modulePath);
const { content, expect } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  it('renders the page on GET', () => {
    return content(example);
  });
  it('ignores pa11y warnings', () => {
    expect(example.ignorePa11yWarnings).to.include('WCAG2AA.Principle1.Guideline1_3.1_3_1.H48');
  });
});
