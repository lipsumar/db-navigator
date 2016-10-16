var d3 = require('d3'),
    DBObject = require('./DBObject.js');

var colWidth = 100;

var DBObjectList = DBObject.extend({
    initialize: function(){
        /*this.svg = opts.svg;
        this.width = 250;*/
        DBObject.prototype.initialize.apply(this, arguments);

        this.outlets = [];


        this.originalHeight = this.height;
        this.model.once('sync', this.renderValues.bind(this));

        this.build();
    },

    headerClicked: function(col){
        this.addOutlet(col);
    },

    addOutlet: function(col){
        this.outlets.push({
            col: col
        });
        this.render();
    },

    // build: function(){
    //     this.el = this.svg.append('g')
    //         .attr('class', 'dbobject');

    //     this.container = this.el.append('rect');

    //     this.originFieldEl = this.el.append('rect')
    //         .attr('class', 'origin');
    //     this.originFieldText = this.el.append('text')
    //         .attr('class', 'originText')
    //         .text(':'+this.model.parsedSlug.originField);

    //     this.dragHandle = this.svg.append('rect')
    //         .attr('transform', 'translate('+this.x+','+(this.y-13)+')')
    //         .attr('class', 'dragHandle');
    //     this.dragHandle.call(d3.drag()
    //         .on('drag', function(e){
    //             this.el.attr('transform', 'translate('+(d3.event.x)+','+(d3.event.y+7)+')');
    //             this.dragHandle.attr('transform', 'translate('+(d3.event.x)+','+(d3.event.y-21+7)+')');
    //             this.pos(d3.event.x,d3.event.y);
    //         }.bind(this)
    //     ));

    //     this.tableTitle = this.el.append('text')
    //         .attr('class', 'tabletitle')
    //         .text(this.model.parsedSlug.table);
    // },

    buildColumns: function(){
        var headerEl = this.el.append('g')
            .attr('class','table-header')
            .attr('transform', 'translate(5,40)');
        var columns = this.model.getTableFields();
        var colX = 0;
        this.columnsX = [];
        columns.forEach(function(field){
            var columnCharWidth = Math.max(10, field.length),
                colWidth = columnCharWidth * 10; // 1 char is 10px
            headerEl.append('text')
                .attr('x', colX)
                .text(field)
                .on('click', this.headerClicked.bind(this, field));
            this.columnsX.push(colX);
            colX+=colWidth;
        }.bind(this));

        this.width = colX;

    },

    renderValues: function(){
        var rows = this.model.get('rows');
        if(rows){


            rows.forEach(function(row, i){
                var rowEl = this.el.append('g')
                    .attr('transform', 'translate(5, '+(i*20+60)+')');
                Object.keys(row).forEach(function(field, i){
                    var valLength = row[field].toString().length;
                    var val = row[field];
                    if(valLength > 9){
                        val = val.substr(0,9) + '…';
                    }
                    rowEl.append('text')
                        .attr('x', this.columnsX[i])
                        .text(val);
                }.bind(this));
                if(i>2){
                    this.height+=20;
                }

            }.bind(this));
        }

    },

    render: function(){

console.log('RENDER');
        this.height = this.originalHeight;

        this.el.attr('transform', 'translate('+this.x+','+(this.y)+')');

        if(this.outlets.length > 0){
            this.outlets.forEach(function(outlet, i){
                this.el.append('rect')
                    .attr('x', this.width - 80)
                    .attr('y', this.height + i*20)
                    .attr('width', 80)
                    .attr('height', 20)
                    .attr('class', 'listoutlet');

                this.el.append('text')
                    .attr('transform', 'translate('+(this.width -78)+','+(this.height + i*20 + 16)+')')
                    .attr('width', 80)
                    .attr('height', 20)
                    .text(outlet.col)
                    .attr('class', 'listoutletText');

                var target = this.el.append('rect')
                    .attr('class', 'outlet')
                    .attr('x', this.width - 5 )
                    .attr('y', this.height + i*20 + 5)
                    .attr('width', 10)
                    .attr('height', 10)
                    .attr('data-i', i)
                    .attr('data-col', outlet.col);

                target.call(d3.drag()
                    .on('start', this.outletStartDrag.bind(this))
                    .on('drag', this.outletDrag.bind(this))
                    .on('end', this.outletEndDrag.bind(this))
                );

                this.el.append('rect');
            }.bind(this));
        }

        this.container
            .attr('width', this.width)
            .attr('height', this.height);

        return this.el;
    }
});

module.exports = DBObjectList;
