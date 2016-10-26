var Backbone = require('backbone'),
    $ = Backbone.$,
    CreationMenuTables = require('./CreationMenuTables.js');



var CreationMenu = Backbone.View.extend({
    className: 'creation-menu hide',
    initialize: function(opts){
        this.subViews = {
            tables: new CreationMenuTables({
                tables: opts.tables
            })
        };
        this.subViews.tables.on('chosen', this.tableChosen.bind(this));
        this.subView = null;
    },

    events:{
        'click .creation-menu__item': 'itemClicked'
    },

    itemClicked: function(e){
        var key = $(e.currentTarget).data('key');
        this.subView = this.subViews[key];
        this.render();
    },

    tableChosen: function(table){
        this.trigger('chosen', table);
    },


    pos: function(xy){
        this.$el.css({
            top: xy[1],
            left: xy[0]
        });
    },
    show: function(){
        this.$el.removeClass('hide');
    },
    hide: function(){
        this.$el.addClass('hide');
    },
    reset: function(){
        this.subView = null;
    },
    render: function(){

        if(this.subView){

            this.$el.empty();
            this.$el.append(this.subView.render().el);

        }else{
            var html = '';
            html += '<div class="creation-menu__item" data-key="tables">Table</div>';
            html += '<div class="creation-menu__item" data-key="macro">Macro</div>';
            html += '<div class="creation-menu__item" data-key="macro">Map/Reduce</div>';
            this.$el.html(html);
        }


        return this;
    }
});

module.exports = CreationMenu;
