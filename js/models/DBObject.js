var Backbone = require('backbone');

var DBObjectModel = Backbone.Model.extend({

    initialize: function(opts){
        this.table = opts.table;
        this.originField = opts.originField;
        this.once('sync', function(){
            this.synced = true;
        }.bind(this));
        this.fetch();
    },

    url: function(){
        //return 'php/index.php?cmd=model&table=' + this.table + '&id=' + this.id + '&idAttribute=' + window.app.idAttribute;
        return 'node/db/model?table=' + this.table + '&value=' + this.id + '&field=' + window.app.idAttribute;
    },

    parse: function(attrs){
        return {row: attrs};
    },

    getValueAsString: function(col){
        return this.get('row')[col] + '';
    },

    getTableFields: function(){
        return window.app.tables[this.table].__fields;
    }
});

module.exports = DBObjectModel;
