const modulePath = 'steps/start/Start.step';

const Start = require(modulePath);
const PetitionProgressBar = require('steps/petition-progress-bar/PetitionProgressBar.step');
const Entry = require('steps/entry/Entry.step');
const { redirect } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  context('navigation', () => {
    it('to PetitionProgressBar page', () => {
      const session = {
        case: {}
      };
      return redirect.navigatesToNext(Start, PetitionProgressBar, session);
    });

    it('to entry page', () => {
      return redirect.navigatesToNext(Start, Entry);
    });
  });
});
