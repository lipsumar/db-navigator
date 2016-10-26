var Backbone = require('backbone'),
    $ = Backbone.$;

var DBAbstract = Backbone.View.extend({
    initialize: function(){
        this.model.once('sync', this.render.bind(this));
    },

    events:{
        'mousedown': 'mousedown',
        'mouseup': 'mouseup',
        'mousedown .dbobject__outlet': 'outletMousedown'
    },

    mousedown: function(e){
        this.dragOffset = [e.offsetX, e.offsetY];
        this.startDrag();
    },
    mouseup: function(){
        this.stopDrag();
    },
    outletMousedown: function(e){
        e.stopPropagation();
        var field = $(e.currentTarget).attr('data-outlet');
        this.trigger('new-cable', this, field);
    },

    startDrag: function(){
        this.listenTo(window.app.mouse, 'move', this.drag.bind(this));
    },
    stopDrag: function(){
        this.stopListening(this.mouse, 'move');
    },
    drag: function(mousePos){
        this.pos(
            mousePos[0] - this.dragOffset[0],
            mousePos[1] - this.dragOffset[1]
        );
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
            this.x = xy[0];// - this.width / 2;
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

    inletPos: function(){
        var $inlet = this.$('.dbobject__inlet');
        if($inlet.length === 0) return this.pos();
        var pos = this.pos(),
            inletPos = $inlet.position();

        return [
            pos[0] + inletPos.left + 5,
            pos[1] + inletPos.top + 5
        ];
    },


    move: function(x, y){
        var pos = this.pos();
        this.pos(pos[0]+x, pos[1]+y);
    },
});

module.exports = DBAbstract;
