const SystemMessage = require('steps/system-message/SystemMessage.step');
const SystemMessageContent = require('steps/system-message/SystemMessage.content');

function testSystemMessage() {
  const I = this;

  I.amOnLoadedPage(SystemMessage.path);
  I.see(SystemMessageContent.en.message1);
}

module.exports = { testSystemMessage };
