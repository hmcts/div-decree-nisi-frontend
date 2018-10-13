const UndefendedPage = require('steps/undefended/Undefended.step');
const content = require('common/content');
const ApplyForDecreeNisi = require('steps/apply-for-decree-nisi/ApplyForDecreeNisi.step');

function testUndefendedPage() {
  const I = this;

  I.amOnLoadedPage(UndefendedPage.path);
  I.navByClick(content.en.continue);

  I.seeCurrentUrlEquals(ApplyForDecreeNisi.path);
}

module.exports = { testUndefendedPage };
