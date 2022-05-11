const modulePath = 'steps/avaya-webchat/AvayaWebchat.step';

const avayaWebchat = require(modulePath);
const { middleware } = require('@hmcts/one-per-page-test-suite');
const { getWebchatOpeningHours } = require('../../../middleware/getWebchatOpenHours');

describe(modulePath, () => {
  it('has getWebchatAvailability middleware', () => {
    return middleware.hasMiddleware(avayaWebchat, [ getWebchatOpeningHours ]);
  });
});
