var DBAbstractView = require('./DBAbstract'),
    TableView = require('./Table');

var DBList = DBAbstractView.extend({
    className: 'dbobject dbobject-list dbobject--loading dbobjectList',


    render: function(){

        if(this.model.synced){
            var html = '<div class="dbobject-list__header"><div class="dbobject__inlet dbobject-list__inlet"></div>'+this.model.table+' ('+this.model.total+')</div>';
            this.$el
                .removeClass('dbobject--loading')
                .html(html);

            var table = new TableView({
                rows: this.model.getRows(),
                fields: this.model.fields
            });
            this.$el.append(table.render().el);

        }else{
            this.$el.html('hey list');
        }

        return this;
    }
});

module.exports = DBList;
