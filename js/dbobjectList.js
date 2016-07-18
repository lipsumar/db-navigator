var DBObject = require('./dbobject.js');
var DBObjectListModel = require('./dbobjectList-model.js');
var d3 = require('d3');

var DBObjectList = DBObject.extend({
    initialize: function(opts){
        this.svg = opts.svg;
        this.pos(opts.x, opts.y);
        this.width = 250;
        this.height = 100;

        this.model = new DBObjectListModel({
            parsedSlug: opts.parsedSlug
        });
        this.model.on('sync', this.render.bind(this));

        this.build();
    },
    build: function(){
        this.el = this.svg.append('g')
            .attr('class', 'dbobject');

        this.container = this.el.append('rect');

        this.originFieldEl = this.el.append('rect')
            .attr('class', 'origin');
        this.originFieldText = this.el.append('text')
            .attr('class', 'originText')
            .text(this.model.parsedSlug.originField);

        this.dragHandle = this.svg.append('rect')
            .attr('transform', 'translate('+this.x+','+(this.y-13)+')')
            .attr('class', 'dragHandle');
        this.dragHandle.call(d3.drag()
            .on('drag', function(e){
                this.el.attr('transform', 'translate('+(d3.event.x)+','+(d3.event.y+7)+')');
                this.dragHandle.attr('transform', 'translate('+(d3.event.x)+','+(d3.event.y-21+7)+')');
                this.pos(d3.event.x,d3.event.y);
            }.bind(this)
        ));

        this.tableTitle = this.el.append('text')
            .attr('class', 'tabletitle')
            .text(this.model.parsedSlug.table);
    },

    render: function(){
        var colWidth = 100;

        this.el.attr('transform', 'translate('+this.x+','+(this.y+8)+')');

        var rows = this.model.get('rows');
        if(rows){
            var headerEl = this.el.append('g')
                .attr('transform', 'translate(5,40)')
            Object.keys(rows[0]).forEach(function(field, x){
                headerEl.append('text')
                    .attr('x', x*colWidth)
                    .text(field);
            });
            this.width = Object.keys(rows[0]).length * colWidth + 20

            rows.forEach(function(row, i){
                var rowEl = this.el.append('g')
                    .attr('transform', 'translate(5, '+(i*20+60)+')');
                Object.keys(row).forEach(function(field, x){
                    var valLength = row[field].toString().length;
                    var val = row[field];
                    if(valLength > 9){
                        val = val.substr(0,9) + '…';
                    }
                    rowEl.append('text')
                        .attr('x', x*colWidth)
                        .text(val);
                });
                if(i>2){
                    this.height+=20;
                }

            }.bind(this));
        }

        this.container
            .attr('width', this.width)
            .attr('height', this.height);
    }
});

module.exports = DBObjectList;
