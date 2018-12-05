const DnNoResponse = require('steps/dn-no-response/DnNoResponse.step');
const DnNoResponseContent = require('steps/dn-no-response/DnNoResponse.content');
const { custom, expect, content } = require('@hmcts/one-per-page-test-suite');
const httpStatus = require('http-status-codes');
const { getExpectedCourtsList, testDivorceUnitDetailsRender,
  testCTSCDetailsRender } = require('test/unit/helpers/courtInformation');

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

  describe('court address details', () => {
    it('should display divorce center details when divorce unit handles case', () => {
      const session = {
        case: {
          data: {
            courts: 'westMidlands',
            court: getExpectedCourtsList()
          }
        }
      };

      return custom(DnNoResponse)
        .withSession(session)
        .get()
        .expect(httpStatus.OK)
        .html($ => {
          const rightHandSideMenu = $('.column-one-third').html();

          testDivorceUnitDetailsRender(rightHandSideMenu);
          expect(rightHandSideMenu).to.include(DnNoResponseContent.en.openTimes)
            .and.to.include(DnNoResponseContent.en.divorceEmail)
            .and.to.include(DnNoResponseContent.en.phoneNumber);
        });
    });

    it('should display service center details when service centre handles case', () => {
      const session = {
        case: {
          data: {
            courts: 'serviceCentre',
            court: getExpectedCourtsList()
          }
        }
      };

      return custom(DnNoResponse)
        .withSession(session)
        .get()
        .expect(httpStatus.OK)
        .html($ => {
          const rightHandSideMenu = $('.column-one-third').html();

          testCTSCDetailsRender(rightHandSideMenu);
          expect(rightHandSideMenu).to.include(DnNoResponseContent.en.openTimes)
            .and.to.include(DnNoResponseContent.en.divorceEmail)
            .and.to.include(DnNoResponseContent.en.phoneNumber);
        });
    });
  });
});
