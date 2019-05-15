/* eslint-disable */

import $ from 'jquery';
import govukFrontend from 'govuk-frontend/all';
import './documentUpload';
import './showHideContent';

window.jQuery = $;

$(document).ready(function() {
  const showHideContent = new global.GOVUK.ShowHideContent();
  showHideContent.init();

  govukFrontend.initAll();
});
