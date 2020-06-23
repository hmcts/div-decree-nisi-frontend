const modulePath = 'helpers/sanitiseUrlHelper';

const { sinon } = require('@hmcts/one-per-page-test-suite');
const urlSanitiser = require(modulePath);

describe(modulePath, () => {
  describe('#sanitiseUrl', () => {
    it('sanitises an empty url@testone', () => {
      const actualUrl = '';
      const expectedUrl = '';
      const sanitisedUrl = urlSanitiser.sanitiseUrl(actualUrl);
      sinon.assert.match(
        sanitisedUrl,
        expectedUrl
      );
    });

    it('sanitises a url with one parameter@testone', () => {
      const actualUrl = '/authenticated?__auth-token=thEt0keN';
      const expectedUrl = '/authenticated';
      const sanitisedUrl = urlSanitiser.sanitiseUrl(actualUrl);
      sinon.assert.match(
        sanitisedUrl,
        expectedUrl
      );
    });

    it('sanitises a url with two parameters@testone', () => {
      const actualUrl = '/authenticated?__auth-token=thEt0keN&code=c0d4c0de&parameter=value';
      const expectedUrl = '/authenticated?parameter=value';
      const sanitisedUrl = urlSanitiser.sanitiseUrl(actualUrl);
      sinon.assert.match(
        sanitisedUrl,
        expectedUrl
      );
    });
  });
});
