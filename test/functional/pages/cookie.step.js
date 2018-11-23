const CookiesPolicy = require('steps/cookies-policy/CookiesPolicy.step');
const CookiesPolicyContent = require('steps/cookies-policy/CookiesPolicy.content');

function testCookiesPolicyPage() {
  const I = this;

  I.amOnLoadedPage(CookiesPolicy.path);

  I.see(CookiesPolicyContent.en.title);
}

module.exports = { testCookiesPolicyPage };
