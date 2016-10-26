var DBAbstractView = require('./DBAbstract'),
    d3 = require('d3');



var DBObjectModel = DBAbstractView.extend({
    className: 'dbobject dbobject--loading',
    initialize: function(){
        this.width = 250;
        this.x = 0;
        this.y = 0;
        this.$el.css('width', this.width);
        DBAbstractView.prototype.initialize.apply(this, arguments);
    },


    outletPos: function(field){
        var $outlet = this.$('[data-outlet="'+field+'"]');
        if($outlet.length === 0) return this.pos();

        var outletPos = $outlet.position(),
            outletRowPos = $outlet.parent().position(),
            pos = this.pos();
        return [
            pos[0] + outletPos.left + 5,
            pos[1] + outletPos.top + outletRowPos.top + 5
        ];
    },


    outletStartDrag: function(offset){
        offset = offset || [0,0];
        var outletEl = arguments[3][0];
        var outletBbox = outletEl.getBBox();
        var col = outletEl.getAttribute('data-col');
        var link = new DBLink({
            source: this,
            sourceOffset: [outletBbox.x + offset[0], outletBbox.y + offset[1]],
            sourceCol: col,
            svg: this.svg
        });
        this.currentLink = link;
    },
    outletDrag: function(){
        var pos = [
            this.x + d3.event.x,
            this.y + d3.event.y
        ];
        this.currentLinkTargetPos = pos;
        this.currentLink.render(pos);
    },
    outletEndDrag: function(){
        var targetTable = prompt('table? (source:'+this.currentLink.sourceCol+')');

        if(targetTable){
            // retrieve value
            var value = this.currentLink.source.model.getValueAsString(this.currentLink.sourceCol);

            var dbo = window.app.createDBObject(targetTable+'/'+value, {pos:this.currentLinkTargetPos});
            this.currentLink.setTarget(dbo);
        }else{
            this.currentLink.remove();
        }


    },



    render: function(){
        this.$el.empty();
        var row = this.model.get('row');
        if(row){
            var html = '<div class="dbobject__inlet dbobject-single__inlet"></div>';
            html+='<div class="dbobject-single__table">'+this.model.table+'</div>';
            html+='<div class="dbobject-single__id">'+this.model.get('id')+'</div>';
            html+='<div class="dbobject-single__attrs">';
            Object.keys(row).forEach(function(col){
                html+='<div class="dbobject-single-attr"><div class="dbobject-single-attr__field">'+col+'</div>';
                html+='<div class="dbobject-single-attr__value">'+row[col]+'</div>';
                html+='<div class="dbobject__outlet dbobject-single__outlet" data-outlet="'+col+'"></div>';
                html+='</div>';
            }.bind(this));
            html+='</div>';
            this.$el
                .removeClass('dbobject--loading')
                .html(html);
        }else{
            // still loading
            this.$el.html('Loading...');
        }

        return this;
    }
});

module.exports = DBObjectModel;
