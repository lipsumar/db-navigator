var d3 = require('d3'),
    DBObject = require('./DBObject.js'),
    utils = require('../utilities');

var DBObjectList = DBObject.extend({
    initialize: function(){
        DBObject.prototype.initialize.apply(this, arguments);

        this.outlets = [];

        this.originalHeight = this.height;
        this.model.once('sync', this.renderValues.bind(this));
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

    buildColumns: function(){
        var headerEl = this.el.append('g')
            .attr('class','table-header')
            .attr('transform', 'translate(5,40)');
        var columns = this.model.getTableFields();
        var colX = 0;

        columns.forEach(function(field){
            var columnCharWidth = field.length,
                colWidth = columnCharWidth * 8.8; // 1 char is 8.8px
            headerEl.append('text')
                .attr('x', colX)
                .text(field)
                .on('click', this.headerClicked.bind(this, field));

            colX+=colWidth + 10;
        }.bind(this));

        this.width = colX;

    },

    renderValues: function(){
        var rows = this.model.getRows();

        if(rows){

            var cols = this.model.getTableFields();
            var model = this.model;
            var colsLengths = [];

            cols.forEach(function(field){

                // find the lenghiest in this column
                var lengthiest = model.getLengthiestValue(field, [field]);
                colsLengths.push(Math.min(10, lengthiest.length));
            });

            var height = this.originalHeight;

            rows.forEach(function(row, y){
                var rowEl = this.el.append('g')
                    .attr('transform', 'translate(5, '+(y*20+60)+')');
                var colX = 0;

                cols.forEach(function(field, i){
                    var val = row.get(field);
                    var valLength = val.toString().length;

                    if(valLength > 10){
                        val = val.substr(0,9) + '…';
                    }

                    colX += i > 0 ? colsLengths[i-1]*8.8+10 : 0;
                    rowEl.append('text')
                        .attr('x', colX)
                        .text(val);

                }.bind(this));

                if(y>1){
                    height+=20;
                }

            }.bind(this));

            this.height = height;
            this.width = utils.sum(colsLengths)*8.8 + colsLengths.length*10;
            this.render();
        }

    },

    buildOutlets: function(){
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
    },

    render: function(){

        //this.height = this.originalHeight;

        this.el.attr('transform', 'translate('+this.x+','+(this.y)+')');

        //this.buildOutlets();

        this.container
            .attr('width', this.width)
            .attr('height', this.height);

        return this.el;
    }
});

module.exports = DBObjectList;
