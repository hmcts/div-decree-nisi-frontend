const modulePath = 'helpers/sanitiseUrlHelper';

const { sinon } = require('@hmcts/one-per-page-test-suite');
const urlSanitiser = require(modulePath);

describe(modulePath, () => {
  describe('#sanitiseUrl', () => {
    it('sanitises an empty URL', () => {
      const actualUrl = '';
      const expectedUrl = '';
      const sanitisedUrl = urlSanitiser.sanitiseUrl(actualUrl);
      sinon.assert.match(
        sanitisedUrl,
        expectedUrl
      );
    });

    it('sanitises a URL with no parameters', () => {
      const actualUrl = '/authenticated?';
      const expectedUrl = '/authenticated';
      const sanitisedUrl = urlSanitiser.sanitiseUrl(actualUrl);
      sinon.assert.match(
        sanitisedUrl,
        expectedUrl
      );
    });

    it('sanitises a URL with one parameter to be removed', () => {
      const actualUrl = '/authenticated?code=c0d4c0de';
      const expectedUrl = '/authenticated';
      const sanitisedUrl = urlSanitiser.sanitiseUrl(actualUrl);
      sinon.assert.match(
        sanitisedUrl,
        expectedUrl
      );
    });

    it('sanitises a URL with two parameters to be removed and one kept', () => {
      const actualUrl = '/authenticated?__auth-token=thEt0keN&code=c0d4c0de&parameter=value';
      const expectedUrl = '/authenticated?parameter=value';
      const sanitisedUrl = urlSanitiser.sanitiseUrl(actualUrl);
      sinon.assert.match(
        sanitisedUrl,
        expectedUrl
      );
    });

    it('returns non-target URLs without change', () => {
      const actualUrl = '/continue-with-divorce';
      const expectedUrl = '/continue-with-divorce';
      const sanitisedUrl = urlSanitiser.sanitiseUrl(actualUrl);
      sinon.assert.match(
        sanitisedUrl,
        expectedUrl
      );
    });
  });
});
