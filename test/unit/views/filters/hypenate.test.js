const modulePath = 'views/filters/hypenate';

const { expect } = require('@hmcts/one-per-page-test-suite');
const filter = require(modulePath);

describe(modulePath, () => {
  it('number should be hypenated', () => {
    const hypenatedNumber = '1234-5678-9090-8908';
    const number = '1234567890908908';
    expect(filter.hypenate(number)).to.eql(hypenatedNumber);
  });
});