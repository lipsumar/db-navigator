var Backbone = require('backbone');
var d3 = require('d3');



var DBLink = Backbone.View.extend({
    className: 'dbcable',
    initialize: function(opts){
        this.cableStrokeWidth = 3;
        this.source = opts.source;
        this.listenTo(this.source, 'move', this.render.bind(this));
        this.target = opts.target;
        this.listenTo(this.target, 'move', this.render.bind(this));
        this.build();
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
            this.$el.css({
                top: this.y,
                left: this.x
            });
            this.trigger('move');
        }else{
            return [this.x, this.y];
        }
    },


    build: function(){
        this.svg = d3.select(this.el).append("svg")
            .attr("width", 0)
            .attr("height", 0);
        this.path = this.svg.append('path');
    },

    render: function(){

        var srcPos = this.source.pos();
        var trgPos = this.target.pos();

        var topLeft = [
            Math.min(srcPos[0], trgPos[0]),
            Math.min(srcPos[1], trgPos[1])
        ];


        this.pos(topLeft);

        var bottomRight = [
            Math.max(srcPos[0], trgPos[0]),
            Math.max(srcPos[1], trgPos[1])
        ];
        var width = Math.max(this.cableStrokeWidth, bottomRight[0] - topLeft[0]);
        var height = Math.max(this.cableStrokeWidth, bottomRight[1] - topLeft[1]);

        this.svg.attr('width', width);
        this.svg.attr('height', height);

        var bezOffset = width/2;

        var bezSrc = [0, 0],
            bezTrg = [width, height];
        var strokeCorrection = this.cableStrokeWidth;
        if(srcPos[0] > trgPos[0]){
            bezSrc[0] = width;
            bezOffset*=-1;
            bezTrg[0] = 0;
        }
        if(srcPos[1] > trgPos[1]){
            bezSrc[1] = height;
            bezTrg[1] = 0;
            strokeCorrection*=-1;
        }



        var path = d3.path();
        path.moveTo(bezSrc[0], bezSrc[1]+strokeCorrection/2);
        path.bezierCurveTo(bezSrc[0]+bezOffset, bezSrc[1], bezTrg[0]-bezOffset,bezTrg[1], bezTrg[0], bezTrg[1] - strokeCorrection/2);
        this.path.attr('d', path.toString());

        return this;
    },

    remove: function(){
        Backbone.View.prototype.remove.apply(this, arguments);
        this.el.remove();
    }
});

module.exports = DBLink;
