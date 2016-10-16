var Backbone = require('backbone');


var DBObjectListModel = Backbone.Model.extend({

    initialize: function(opts){
        this.originField = opts.originField;
        this.table = opts.table;
        this.fetch();
    },

    url: function(){
        return 'php/index.php?cmd=list&table=' + this.table + '&originField=' + this.originField + '&originValue=' + this.id;
    },

    // @todo DRY
    getTableFields: function(){
        return window.app.tables[this.table].__fields;
    }
});

module.exports = DBObjectListModel;
