const DnNoResponse = require('steps/dn-no-response/DnNoResponse.step');

const { content } = require('@hmcts/one-per-page-test-suite');

describe('DnNoResponse step', () => {
  it('renders the content', () => {
    const ignoreContent = ['continue'];
    const session = { case: { data: {} } };
    const specificContent = [
      'believeRespChoseNotToRespond.formD89',
      'applyD11',
      'doneWithAllWaysOfDelivering.applyD13bLink'
    ];
    return content(DnNoResponse, session, { specificContent, ignoreContent });
  });
});
