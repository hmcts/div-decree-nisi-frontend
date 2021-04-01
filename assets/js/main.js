/* eslint-disable */

import $ from 'jquery';
import govukFrontend from 'govuk-frontend/all';
import './documentUpload';
import './showHideContent';

window.jQuery = $;

$(document).ready(() => {
  const showHideContent = new global.GOVUK.ShowHideContent();
  showHideContent.init();

  $('input.button[type="submit"]').click(event => {
    const $el = $(event.target);
    setTimeout(() => {
      $el.attr('disabled', true);
      $el.attr('aria-disabled', true);
    });
  });

  govukFrontend.initAll();
});
