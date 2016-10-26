var Backbone = require('backbone'),
    $ = Backbone.$;


var CreationMenuTables = Backbone.View.extend({
    className: 'creation-menu-tables',
    initialize: function(opts){
        this.tables = opts.tables;
    },

    events:{
        'click .creation-menu-tables__item': 'itemClicked'
    },

    itemClicked: function(e){
        var table = $(e.currentTarget).data('table');
        this.trigger('chosen', table);
    },

    render: function(){
        var html = '';
        this.tables.forEach(function(table){
            html += '<div class="creation-menu-tables__item" data-table="'+table+'">'+table+'</div>';
        });

        this.$el.html(html);
        return this;
    }
});

module.exports = CreationMenuTables;
