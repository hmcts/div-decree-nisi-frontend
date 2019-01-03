const RespNotAdmitAdultery = require('steps/resp-not-admit-adultery/RespNotAdmitAdultery.step');

const RespNotAdmitAdulteryContent = require(
  'steps/resp-not-admit-adultery/RespNotAdmitAdultery.content'
);
const content = require('common/content');
const ApplyForDecreeNisi = require('steps/apply-for-decree-nisi/ApplyForDecreeNisi.step');

function testRespNotAdmitAdultery() {
  const I = this;

  I.amOnLoadedPage(RespNotAdmitAdultery.path);
  I.checkOption(RespNotAdmitAdulteryContent.en.fields.amendPetition.no);
  I.navByClick(content.en.continue);

  I.seeCurrentUrlEquals(ApplyForDecreeNisi.path);
}

module.exports = { testRespNotAdmitAdultery };
