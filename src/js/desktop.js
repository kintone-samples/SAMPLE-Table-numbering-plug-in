/*
 * This sample plugin automatically adds row numbers to tables every time the record is saved.
 * Copyright (c) 2018 Cybozu
 *
 * Licensed under the MIT License
 */
(function(PLUGIN_ID) {
    'use strict';

    // Get plugin configuration settings
    var CONFIG = kintone.plugin.app.getConfig(PLUGIN_ID);
    // Get each settings
    if (!CONFIG) {
        return false;
    }

    var TABLEFIELD = CONFIG.table_field; //field code of the table
    var NUMBERFIELD = CONFIG.number_field; //field code of number field in the table

    var events = [
        'app.record.create.submit',
        'app.record.edit.submit'
    ];
    kintone.events.on(events, function(event) {
        var record = event.record;

        //auto-number the table rows
        var count = record[TABLEFIELD].value.length;
        for (var i = 0; i < count; i++) {
            record[TABLEFIELD].value[i].value[NUMBERFIELD].value = i + 1;
        }

        return event;
    });
})(kintone.$PLUGIN_ID);
