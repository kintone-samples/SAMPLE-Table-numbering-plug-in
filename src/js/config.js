jQuery.noConflict();
(function($, PLUGIN_ID) {
    'use strict';
    // Get configuration settings

    var CONF = kintone.plugin.app.getConfig(PLUGIN_ID);

    function escapeHtml(htmlstr) {
        return htmlstr.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function setDropDown() {
        // Retrieve field information, then set dropdown
        return kintone.api(kintone.api.url('/k/v1/preview/app/form/fields', true), 'GET',
            {'app': kintone.app.getId()}).then(function(resp) {

            for (var key in resp.properties) {
                if (!resp.properties.hasOwnProperty(key)) {
                    continue;
                }
                var prop = resp.properties[key];

                if (prop.type === 'SUBTABLE') {
                    for (var key2 in prop.fields) {
                        var field = prop.fields[key2];
                        var $option = $('<option>');
                        if (field.type === 'NUMBER') {
                            $option.attr('value', prop.code + ',' + field.code); //Set table code and number field code
                            $option.text(escapeHtml(field.label));
                            $('#select_number_field').append($option.clone());
                        }
                    }
                }
            }
            // Set default values
            $('#select_number_field').val(CONF.table_field + ',' + CONF.number_field);
        }, function(resp) {
            return alert('Failed to retrieve field(s) information');
        });
    }
    $(document).ready(function() {
        // Set dropdown list
        setDropDown();
        // Set input values when 'Save' button is clicked
        $('#check-plugin-submit').click(function() {
            var config = [];
            var number_field = $('#select_number_field').val();
            // Check required fields
            if (number_field === '') {
                alert('Please set required field(s)');
                return;
            }

            config.table_field = number_field.split(',')[0];//Set table field code
            config.number_field = number_field.split(',')[1];//Set number field code

            kintone.plugin.app.setConfig(config);
        });
        // Process when 'Cancel' is clicked
        $('#check-plugin-cancel').click(function() {
            history.back();
        });
    });
})(jQuery, kintone.$PLUGIN_ID);
