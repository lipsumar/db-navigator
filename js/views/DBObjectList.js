var d3 = require('d3'),
    DBObject = require('./DBObject.js'),
    ColumnChooser = require('./ColumnChooser');

var CELL_SPACING = 10,
    CHARACTER_WIDTH = 8.8,
    COL_LENGTH_MAX_CHARS = 10,
    DEFAULT_DISPLAY_COL_COUNT = 3;

var DBObjectList = DBObject.extend({
    initialize: function(){
        this.setDisplayCols(this.model.getTableFields().slice(0,DEFAULT_DISPLAY_COL_COUNT));
        DBObject.prototype.initialize.apply(this, arguments);

        this.outlets = [];
        this.originalHeight = this.height;
    },

    setDisplayCols: function(displayCols){
        this.displayCols = displayCols;
        this.renderValues();
    },

    buildColumns: function(colsLengths){
        colsLengths = colsLengths || [];
        this.el.select('g.table-header').remove();
        this.el.select('g.table-footer').remove();

        var headerEl = this.el.append('g')
            .attr('class','table-header')
            .attr('transform', 'translate(5,40)');
        var footerEl = this.el.append('g')
            .attr('class','table-footer')
            .attr('transform', 'translate(5,40)');

        var colX = 0;
        var width = 0;

        this.displayCols.forEach(function(field, i){
            if(this.displayCols.indexOf(field)===-1) return;

            var columnCharWidth = field.length,
                colWidth = (colsLengths[i] || columnCharWidth) * CHARACTER_WIDTH;
            headerEl.append('text')
                .attr('x', colX)
                .text(field);

            var colFoot = footerEl.append('g')
                .attr('transform', 'translate('+colX+', 0)');
            colFoot.append('rect')
                .attr('class', 'foot-outlet')
                .attr('width', colWidth)
                .attr('height', 20);
            colFoot.append('text')
                .attr('y', 16)
                .attr('class', 'foot-outlet__text')
                .text(field);

            // target must be added on this.el directly
            footerEl.append('rect')
                .attr('class', 'outlet')
                .attr('x',  colX + (colWidth/2 - 5))
                .attr('y', 20)
                .attr('width', 10)
                .attr('height', 10)
                .attr('data-col', field)
                .call(d3.drag()
                    .on('start', function(){
                        var args = [].slice.call(arguments);
                        [].unshift.call(args,[15, this.height+5]);
                        this.outletStartDrag.apply(this, args);
                    }.bind(this))
                    .on('drag', this.outletDrag.bind(this))
                    .on('end', this.outletEndDrag.bind(this))
                );


            colX+=colWidth + CELL_SPACING;
        }.bind(this));
        width = colX;


        // column chooser
        var cols = this.model.getTableFields();
        if(this.displayCols.length < cols.length){
            var text = '+ '+(cols.length - this.displayCols.length) + ' more';
            this.colChooserBtn = headerEl.append('text')
                .attr('x', width)
                .text(text)
                .on('click', this.displayColChooser.bind(this));
            width+= text.length*CHARACTER_WIDTH + CELL_SPACING;
        }

        return width;

    },

    renderValues: function(){

        var rows = this.model.getRows();
        if(!rows || !this.built) return;
        this.el.select('g.table-container').remove();

        //var cols = this.model.getTableFields();
        var model = this.model;

        var g = this.el.append('g').attr('class', 'table-container');

        g.append('rect')
            .attr('transform', 'translate('+(model.table.length*CHARACTER_WIDTH+CELL_SPACING)+', 3)')
            .attr('class', 'total')
            .attr('width', model.total.toString().length*CHARACTER_WIDTH + CELL_SPACING*2)
            .attr('height', 17);
        g.append('text')
            .attr('transform', 'translate('+(model.table.length*CHARACTER_WIDTH+CELL_SPACING*2)+', 16)')
            .attr('class', 'total__text')
            .text(model.total);

        var colsLengths = [];
        this.displayCols.forEach(function(field){
            //if(this.displayCols.indexOf(field)===-1) return;

            // find the lenghiest in this column
            var lengthiest = model.getLengthiestValue(field, [field]);

            // always display the field name in full
            var maxChar = Math.max(COL_LENGTH_MAX_CHARS, field.length);

            colsLengths.push(Math.min(maxChar, lengthiest.length));
        }.bind(this));

        var colsWidth = this.buildColumns(colsLengths);

        var height = this.originalHeight;
        var width = 0;
        rows.forEach(function(row, y){
            var rowEl = g.append('g')
                .attr('transform', 'translate(5, '+(y*20+60)+')');
            var colX = 0;

            this.displayCols.forEach(function(field, i){

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

            width = colX;

            if(y>1){
                height+=20;
            }

        }.bind(this));


        if( model.total > rows.length){
            g.append('text')
                .attr('transform', 'translate(5, '+(rows.length*20+60)+')')
                .text('+ ' + (model.total - rows.length) + ' more…');
            height+=10;
        }

        this.el.select('.table-footer').attr('transform', 'translate(5,'+height+')');

        this.height = height;
        this.width = Math.max(width, colsWidth);
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

    displayColChooser: function(){
        var chooser = new ColumnChooser({
            source: this.colChooserBtn,
            columns: this.model.getTableFields(),
            chosenColumns: this.model.getTableFields().slice(0,3)
        }).render();
        chooser.on('toggle', this.setDisplayCols.bind(this));
    },

    render: function(){

        this.el.attr('transform', 'translate('+this.x+','+(this.y)+')');

        //this.buildOutlets();

        this.container
            .attr('width', this.width)
            .attr('height', this.height);

        return this.el;
    }
});

module.exports = DBObjectList;
