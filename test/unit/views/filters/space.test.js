const modulePath = 'views/filters/space';

const { expect } = require('@hmcts/one-per-page-test-suite');
const filter = require(modulePath);
const Entities = require('html-entities').AllHtmlEntities;

describe(modulePath, () => {
  it('number should be formatted with spacing', () => {
    const numberWithSpacing = '1234 5678 9090 8908';
    const number = '1234567890908908';
    const entities = new Entities();
    expect(entities.decode(filter.space(number))).to.eql(numberWithSpacing);
  });
});