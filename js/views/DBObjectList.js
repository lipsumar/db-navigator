var d3 = require('d3'),
    DBObject = require('./DBObject.js'),
    utils = require('../utilities');

var CELL_SPACING = 10,
    CHARACTER_WIDTH = 8.8,
    COL_LENGTH_MAX_CHARS = 10;

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

    buildColumns: function(colsLengths){
        colsLengths = colsLengths || [];
        this.el.select('g.table-header').remove();

        var headerEl = this.el.append('g')
            .attr('class','table-header')
            .attr('transform', 'translate(5,40)');
        var columns = this.model.getTableFields();
        var colX = 0;

        columns.forEach(function(field, i){
            var columnCharWidth = field.length,
                colWidth = (colsLengths[i] || columnCharWidth) * CHARACTER_WIDTH;
            headerEl.append('text')
                .attr('x', colX)
                .text(field)
                .on('click', this.headerClicked.bind(this, field));

            colX+=colWidth + CELL_SPACING;
        }.bind(this));

        this.width = colX;

    },

    renderValues: function(){
        this.renderValues = function(){};
        var rows = this.model.getRows();
        if(!rows) return;

        var cols = this.model.getTableFields();
        var model = this.model;

        this.el.append('rect')
            .attr('transform', 'translate('+(model.table.length*CHARACTER_WIDTH+CELL_SPACING)+', 3)')
            .attr('class', 'total')
            .attr('width', model.total.toString().length*CHARACTER_WIDTH + CELL_SPACING*2)
            .attr('height', 17);
        this.el.append('text')
            .attr('transform', 'translate('+(model.table.length*CHARACTER_WIDTH+CELL_SPACING*2)+', 16)')
            .attr('class', 'total__text')
            .text(model.total);

        var colsLengths = [];
        cols.forEach(function(field){

            // find the lenghiest in this column
            var lengthiest = model.getLengthiestValue(field, [field]);

            // always display the field name in full
            var maxChar = Math.max(COL_LENGTH_MAX_CHARS, field.length);

            colsLengths.push(Math.min(maxChar, lengthiest.length));
        });

        this.buildColumns(colsLengths);

        var height = this.originalHeight;
        rows.forEach(function(row, y){
            var rowEl = this.el.append('g')
                .attr('transform', 'translate(5, '+(y*20+60)+')');
            var colX = 0;

            cols.forEach(function(field, i){
                var val = row.get(field);
                var valLength = val.toString().length;

                var maxChar = Math.max(COL_LENGTH_MAX_CHARS, field.length);
                if(valLength > maxChar){
                    val = val.substr(0,maxChar-1) + '…';
                }

                colX += i > 0 ? colsLengths[i-1]*CHARACTER_WIDTH + CELL_SPACING : 0;
                rowEl.append('text')
                    .attr('x', colX)
                    .text(val);

            }.bind(this));

            if(y>1){
                height+=20;
            }

        }.bind(this));



        if( model.total > rows.length){
            this.el.append('text')
                .attr('transform', 'translate(5, '+(rows.length*20+60)+')')
                .text('and ' + (model.total - rows.length) + ' more…');
            height+=10;
        }


        this.height = height;
        this.width = utils.sum(colsLengths)*CHARACTER_WIDTH + colsLengths.length*CELL_SPACING;
        this.render();


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
