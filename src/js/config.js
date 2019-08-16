/*
MIT License
Copyright (c) 2018 Cybozu
https://github.com/kintone/SAMPLE-Table-numbering-plug-in/blob/master/LICENSE
*/

jQuery.noConflict();
(function($, PLUGIN_ID) {
  'use strict';
  // Get configuration settings

  var CONF = kintone.plugin.app.getConfig(PLUGIN_ID);
  var $form = $('.js-submit-settings');
  var $cancelButton = $('.js-cancel-button');
  var $number = $('select[name="js-select-number-field"]');

  function escapeHtml(htmlstr) {
    return htmlstr.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function setDropDown() {
    // Retrieve field information, then set drop-down
    return kintone.api(kintone.api.url('/k/v1/preview/app/form/fields', true), 'GET',
      {'app': kintone.app.getId()}).then(function(resp) {
      var key, key2, prop, field, $option;

      for (key in resp.properties) {
        if (!Object.prototype.hasOwnProperty.call(resp.properties, key)) {
          continue;
        }
        prop = resp.properties[key];
        if (prop.type === 'SUBTABLE') {
          for (key2 in prop.fields) {
            if (!Object.prototype.hasOwnProperty.call(prop.fields, key2)) {
              continue;
            }
            field = prop.fields[key2];
            $option = $('<option></option>');
            if (field.type === 'NUMBER') {
              $option.attr('value', prop.code + ',' + field.code); // Set table code and number field code
              $option.text(escapeHtml(field.label));
              $number.append($option.clone());
            }
          }
        }
      }
      // Set default values
      $number.val(CONF.table + ',' + CONF.number);
    }, function() {
      return alert('Failed to retrieve field(s) information');
    });
  }
  $(document).ready(function() {
    // Set drop-down list
    setDropDown();
    // Set input values when 'Save' button is clicked
    $form.on('submit', function(e) {
      var config = [];
      var number = $number.val();
      e.preventDefault();

      config.table = number.split(',')[0];// Set table field code
      config.number = number.split(',')[1];// Set number field code
      
      kintone.plugin.app.setConfig(config, function() {
        alert('The plug-in settings have been saved. Please update the app!');
        window.location.href = '/k/admin/app/flow?app=' + kintone.app.getId();
      });
    });
    // Process when 'Cancel' is clicked
    $cancelButton.on('click', function() {
      window.location.href = '/k/admin/app/' + kintone.app.getId() + '/plugin/';
    });
  });
})(jQuery, kintone.$PLUGIN_ID);
