import $ from 'jquery';
import ShowHideContent from 'govuk/show-hide-content';
import './documentUpload';

$(document).ready(() => {
  const showHideContent = new ShowHideContent();
  showHideContent.init();
});
