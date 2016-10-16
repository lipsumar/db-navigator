var Backbone = require('backbone'),
    d3 = require('d3'),
    DBLink = require('./DBLink.js');



var DBObject = Backbone.View.extend({
    initialize: function(opts){
        this.svg = opts.svg;
        this.width = 200;
        this.height = 100;
        this.x = 0;
        this.y = 0;

        this.on('move', this.render.bind(this));

        this.build();
        this.model.once('sync', this.renderValues.bind(this));

    },

    /**
     * Get or set position.
     * Triggers "move" when set.
     *
     * @param {pos} Optional. Array
     * @return {mixed} void or Array
     */
    pos: function(){
        if(arguments.length > 0){
            var xy = arguments.length > 1 ? arguments : arguments[0];
            this.x = xy[0];
            this.y = xy[1];
            this.trigger('move');
        }else{
            return [this.x, this.y];
        }
    },

    move: function(x, y){
        var pos = this.pos();
        this.pos(pos[0]+x, pos[1]+y);
    },


    outletStartDrag: function(){
        var outletEl = arguments[2][0];
        var col = outletEl.getAttribute('data-col');
        var link = new DBLink({
            source: this,
            sourceOffset: [this.width, outletEl.y.baseVal.value + 5],
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

            var dbo = window.app.createDBObject(targetTable+'/'+value, this.currentLinkTargetPos);
            this.currentLink.setTarget(dbo);
        }else{
            this.currentLink.remove();
        }


    },

    /**
     * Builds the view for the first time.
     * This should only be called once.
     *
     * @return {[type]} [description]
     */
    build: function(){
        this.el = this.svg.append('g')
        //this.el = d3.select(document.createElementNS(d3.namespaces.svg, 'g'))
            .attr('class', 'dbobject');

        this.container = this.el.append('rect');

        this.originFieldEl = this.el.append('rect')
            .attr('class', 'origin');
        this.originFieldText = this.el.append('text')
            .attr('class', 'originText')
            .text(this.model.originField+'='+this.model.id);


        this.tableTitle = this.el.append('text')
            .attr('class', 'tabletitle')
            .text(this.model.table);

        this.buildColumns();

        // drag handle
        this.el.append('rect')
            .attr('class', 'drag')
            .attr('x', 0)
            .attr('y', -21)
            .attr('width', 200)
            .attr('height', 50)
            .attr('cursor', 'move')
            .call(d3.drag()
                .on('start', function(){
                    var x = d3.event.x,
                        y = d3.event.y;
                    this.startDragOffset = [x,y]; // there is probably a nicer way....
                }.bind(this))
                .on('drag', function(){
                    var x = d3.event.x - this.startDragOffset[0],
                        y = d3.event.y + 20 + this.startDragOffset[1];
                    this.move(x, y);
                }.bind(this))

            );
        this.built = true;
    },

    buildColumns: function(){
        var colsG = this.el.append('g').attr('class', 'columns');
        var columns = this.model.getTableFields();
        columns.forEach(function(col, i){
            var colG = colsG.append('g')
                .attr('transform','translate(0, '+(i*20)+')')
                .attr('data-col', col);
            colG.append('text').text(col);
            colG.append('text')
                .attr('class', 'value')
                .attr('x', this.width-20)
                .attr('text-anchor', 'end');

            var target = this.el.append('rect')
                .attr('class', 'outlet')
                .attr('x', this.width-5)
                .attr('y', i*20 + 30)
                .attr('width', 10)
                .attr('height', 10)
                .attr('data-col', col);

            target.call(d3.drag()
                .on('start', this.outletStartDrag.bind(this))
                .on('drag', this.outletDrag.bind(this))
                .on('end', this.outletEndDrag.bind(this))
            );

            //target.node().view = this;
            if(i>2){
                this.height+=20;
            }
        }.bind(this));
    },

    renderValues: function(){
        var row = this.model.get('row');
        if(row){
            Object.keys(row).forEach(function(col){
                var valLength = row[col].toString().length;
                var val = row[col];
                if(valLength > 9){
                    val = val.substr(0,9) + '…';
                }
                this.el.select('g[data-col="'+col+'"] text.value').text(val);
            }.bind(this));

        }
    },

    render: function(){
        this.el.attr('transform', 'translate('+this.x+','+(this.y)+')');
        this.container
            .attr('width', this.width)
            .attr('height', this.height);

        return this.el;
    }
});

module.exports = DBObject;
