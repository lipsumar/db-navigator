var Backbone = require('backbone');

var DBObjectModel = Backbone.Model.extend({

    initialize: function(opts){
        this.table = opts.table;
        this.fetch();
    },

    url: function(){
        return 'php/index.php?cmd=model&table=' + this.table + '&id=' + this.id;
    },

    getValueAsString: function(col){
        return this.get('row')[col] + '';
    },

    getTableFields: function(){
        return window.app.tables[this.table].__fields;
    }
});

module.exports = DBObjectModel;
