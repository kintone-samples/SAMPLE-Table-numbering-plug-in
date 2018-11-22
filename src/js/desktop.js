/*
 * This sample plug-in automatically adds row numbers to table rows each time the record is saved.
 * Copyright (c) 2018 Cybozu
 *
 * Licensed under the MIT License
 */
(function(PLUGIN_ID) {
    'use strict';

    // Get plug-in configuration settings
    var CONFIG = kintone.plugin.app.getConfig(PLUGIN_ID);
    // Get each setting
    if (!CONFIG) {
        return false;
    }

    var TABLEFIELD = CONFIG.table_field; // Field code of the table
    var NUMBERFIELD = CONFIG.number_field; // Field code of number field in the table

    // Disable number fields in table at these events
    var disableEvents = [
        'app.record.edit.show',
        'app.record.create.show',
        'app.record.edit.change.' + TABLEFIELD,
        'app.record.create.change.' + TABLEFIELD
    ];
    
    kintone.events.on(disableEvents, function(event){
        var record = event.record;

        // Disable number fields in table rows
        var count = record[TABLEFIELD].value.length;
        for (var i = 0; i < count; i++) {
            record[TABLEFIELD].value[i].value[NUMBERFIELD]['disabled'] = true;
        };
        return event;
    });

    // Number table rows at these events
    var numberEvents = [
        'app.record.create.submit',
        'app.record.edit.submit'
    ];
    kintone.events.on(numberEvents, function(event) {
        var record = event.record;

        // Auto-number the table rows
        var count = record[TABLEFIELD].value.length;
        for (var i = 0; i < count; i++) {
            record[TABLEFIELD].value[i].value[NUMBERFIELD].value = i + 1;
        }

        return event;
    });
})(kintone.$PLUGIN_ID);
