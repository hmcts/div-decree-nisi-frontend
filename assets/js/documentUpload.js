/* eslint-disable */

(function (global) {

  var documentUpload = function() {

    var csrfToken = jQuery('input[name="_csrf"]').attr('value');

    return {
      $zone: null,
      $fileList: jQuery('.uploaded-files-wrapper').eq(0),

      init: function(options) {

        options = options || {
          uploadingHint: 'Uploading',
          pendingUploadHint: 'Pending Upload',
          hideErrorFileLink: 'Hide',
          removeFileLink: 'Remove',
          errors: {
            errorMaximumFilesExceeded: 'You can upload a maximum of 10 files.',
            errorUnknown: 'Sorry there has been a problem with this upload',
            errorFileSizeTooLarge: 'This file is too large and exceeds the 10mb limit. Please reduce the size of the file and try again.',
            errorFileTypeInvalid: 'You can only upload valid images e.g. .png, .jpeg, .jpg, .pdf',
            errorVirusFoundInFile: 'This file has failed a virus check. Please try again with a different file.'
          }
        };

        var self = this,
            dzOptions;
        self.$zone = jQuery('.document-upload');
        self.$zone.find('.hidden').removeClass('hidden');
        this.$fileList.removeClass('hidden');
        dzOptions = {
          dictFileTooBig: options.errors.errorFileSizeTooLarge,
          dictMaxFilesExceeded: options.errors.errorMaximumFilesExceeded,
          dictInvalidFileType: options.errors.errorFileTypeInvalid,
          init: function() {
            this.on('drop', function() {
              jQuery('.dz-preview').remove();
            });
            this.on('uploadprogress', function(file, progress){
              if(file.element){
                file.element.find('span.upload-progress').attr('style', 'width:'+progress+'%;');
                file.element.find('span.form-hint').html(' - ' + options.uploadingHint);
              }
            });
            this.on('complete', function(file){
              if(file.element){
                file.element.removeClass('uploading');
              }
            });
            this.on('success', function(file, resp){
              if(file.element && resp && resp.length){
                jQuery(file.element).find('.remove-file').data('fileurl', resp[0].fileUrl);
              }
            });
            this.on('canceled', function(file){
              if(file.element){
                file.element.addClass('error');
                file.element.find('span.form-hint').remove();
                file.element.find('td:first')
                  .addClass('govuk-form-group--error')
                  .append('<span class="govuk-error-message">' + options.errors.errorUnknown + '</span>');
              }
              if(!this.getQueuedFiles().length){
                jQuery('input[type="submit"]').prop('disabled', false);
              }
            });
            this.on('error', function(file, errorMessage){
              var errorMessageText = options.errors.errorUnknown;

              if(errorMessage && errorMessage.code && options.errors[errorMessage.code]){
                errorMessageText = options.errors[errorMessage.code];
              }

              if(file.element){
                file.element.addClass('error');
                file.element.find('span.form-hint').remove();
                file.element.find('td:first')
                  .addClass('govuk-form-group--error')
                  .append('<span class="govuk-error-message">' + errorMessageText + '</span>');
              }
              if(!this.getQueuedFiles().length){
                jQuery('input[type="submit"]').prop('disabled', false);
              }
              setTimeout(function(){
                jQuery('.dz-preview').fadeOut(function(){
                  jQuery('.dz-preview').remove();
                });
              }, 2000);
            });
            this.on('addedfile', function(){
              jQuery('input[type="submit"]').attr('disabled', 'disabled');
            });
            this.on('queuecomplete', function(){
              jQuery('input[type="submit"]').prop('disabled', false);
            });
            self.addExsistingFiles(this);
            self.bindEvents(this);
          },
          autoProcessQueue: true,
          addRemoveLinks: true,
          createImageThumbnails: false,
          paramName: 'file',
          parallelUploads: 1,
          url: document.URL + self.queryParamAppender(document.URL) + 'js=true&_csrf=' + csrfToken,
          maxFilesize: 10,
          timeout: 5 * (60 * 1000), //  5 minutes
          acceptedFiles: 'image/x-png,image/png,image/jpeg,image/jpg,application/pdf,image/tiff,image/tif,image/bmp',
          maxFiles: 10,
          accept: function(file, done) {
            done();
            self.addFileToList(file);
          }
        };

        jQuery.extend(dzOptions, options);

        this.options = dzOptions;

        self.$zone.dropzone(dzOptions);

        // fix a11y tests
        if(jQuery('.dz-hidden-input').length){
          var att = document.createAttribute('title');
          att.value = 'Upload file';
          jQuery('.dz-hidden-input')[0].setAttributeNode(att);
        }
      },

      queryParamAppender: function(url) {
        return url.indexOf('?') > 0 ? '&' : '?';
      },

      addExsistingFiles: function(dropzone){
        jQuery('.file').each(function($row){
          dropzone.files.push({
            accepted: true,
            status: 'success'
          });
        });
      },

      bindEvents: function(dropzone) {
        var self = this;

        jQuery(document).on('click', 'a.faux-link', function(e) {
            e.preventDefault();
        });
        this.$fileList.on('click', '.remove-file', function(e) {
          e.preventDefault();
          var $file = jQuery(this).parents('.file');
          var fileUrl = jQuery(this).data('fileurl');
          jQuery.ajax({
            url: window.location + self.queryParamAppender(window.location.href) + 'js=true&fileUrl=' + encodeURI(fileUrl) + '&_csrf=' + csrfToken,
            type: 'DELETE',
            success: function() {
              self.removeFileFromList($file);
              for(var i = 0; i < dropzone.files.length; i++){
                if(dropzone.files[i].status === 'success'){
                  dropzone.files.splice(i, 1);
                  return;
                }
              }
            }
          });
        });
        this.$fileList.on('click', '.hide-file', function(e) {
          e.preventDefault();
          var $file = jQuery(this).parents('.file');
          self.removeFileFromList($file);
        });

        jQuery(document).on('keydown', 'a.faux-link, .dz-clickable', function(e) {
          if([13, 32].includes(e.keyCode)) { // pressed RETURN or SPACE
            e.preventDefault();
            e.stopPropagation();
            self.$zone.trigger('click');
            return false;
          }
        });
      },

      addFileToList: function(file) {
        var self = this;
        self.removeFilePreview(file);
        self.addFileToUploadList(file);
      },

      removeFileFromList: function($el) {
        var self = this;

        $el.fadeOut(400, function() {
          $el.remove();

          if(!self.$fileList.find('.file').length) {
            self.$fileList.find('.no-files').show();
          }

        });
      },

      addFileToUploadList: function(file){
        var self = this;

        var $element = jQuery('<tr/>')
        .addClass('file')
        .addClass('uploading')
        .addClass('govuk-table__row')
        .html(
          '<td class="govuk-table__cell">' + file.name + ' <span class="form-hint"> - ' + this.options.pendingUploadHint + '</span><span class="upload-progress"></span></td>' +
          '<td class="govuk-table__cell"><a class="link remove-file govuk-link" href="#" aria-label="Remove file link">' + this.options.removeFileLink + '</a><a class="link hide-file govuk-link" href="#" aria-label="Hide this file link">' + this.options.hideErrorFileLink + '</a></td>'
        );

        self.$fileList.find('.no-files').hide();
        self.$fileList.find('table tbody').append($element);
        file.element = $element;

      },

      removeFilePreview: function(file) {
        var self = this;
        jQuery(file.previewElement).remove();
        self.$zone.removeClass('dz-started dz-drag-hover');
      }
    };
  };

  global.DIVORCE = global.DIVORCE || {};
  global.DIVORCE.documentUpload = documentUpload;


})(window);
