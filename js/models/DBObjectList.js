var Backbone = require('backbone');


var DBObjectListModel = Backbone.Collection.extend({

    initialize: function(opts){
        this.originField = opts.originField;
        this.table = opts.table;
        this.id = opts.id;
        this.fetch();
    },

    parse: function(resp){
        this.total = parseInt(resp.countTotal, 10);
        return resp.rows;
    },

    url: function(){
        return 'php/index.php?cmd=list&table=' + this.table + '&originField=' + this.originField + '&originValue=' + this.id;
    },

    // @todo DRY
    getTableFields: function(){
        return window.app.tables[this.table].__fields;
    },

    getRows: function(){
        return this.models;
    },

    getValues: function(field){
        return this.pluck(field);
    },

    getLengthiestValue: function(field, additionalValues){
        var values = this.pluck(field).concat(additionalValues || []);

        var l = 0,
            lengthiest;
        for (var i = 0; i < values.length; i++) {
            if(values[i].length > l){
                l = values[i].length;
                lengthiest = values[i];
            }
        }
        return lengthiest;
    }
});

module.exports = DBObjectListModel;
