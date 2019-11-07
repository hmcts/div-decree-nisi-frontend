const modulePath = 'views/filters/defined';

const { expect } = require('@hmcts/one-per-page-test-suite');
const filter = require(modulePath);

describe(modulePath, () => {
  it('should return true when input is valid', () => {
    const input = 'valid';
    expect(filter.defined(input)).to.eql(true);
  });

  it('should return false when input is false', () => {
    const input = false;
    expect(filter.defined(input)).to.eql(false);
  });

  it('should return false when input is null', () => {
    const input = null;
    expect(filter.defined(input)).to.eql(false);
  });

  it('should return false when input is undefined', () => {
    const input = undefined;
    expect(filter.defined(input)).to.eql(false);
  });

  it('should return false when input is empty', () => {
    const input = '';
    expect(filter.defined(input)).to.eql(false);
  });

  it('should return false when input is empty object', () => {
    const input = {};
    expect(filter.defined(input)).to.eql(false);
  });

  it('should return true when input is object with values', () => {
    const input = {
      one: 'hello',
      two: 'world'
    };
    expect(filter.defined(input)).to.eql(true);
  });

  it('should return true when input is object with at least 1 value', () => {
    const input = {
      one: false,
      two: undefined,
      three: false,
      four: 'some value'
    };
    expect(filter.defined(input)).to.eql(true);
  });

  it('should return false when input is object with no values', () => {
    const input = {
      one: '',
      two: null,
      three: undefined,
      four: false,
      five: 0
    };
    expect(filter.defined(input)).to.eql(false);
  });

  it('should return false when input is object with no values', () => {
    const input = {
      one: '',
      two: null,
      three: undefined,
      four: false,
      five: 0
    };
    expect(filter.defined(input)).to.eql(false);
  });
});
