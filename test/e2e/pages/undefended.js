const UndefendedPage = require('steps/undefended/Undefended.step');
const content = require('common/content');

function seeUndefendedPage() {
  const I = this;

  I.seeCurrentUrlEquals(UndefendedPage.path);
  I.navByClick(content.en.continue);
}

module.exports = { seeUndefendedPage };