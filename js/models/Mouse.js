var Backbone = require('backbone');

var Mouse = Backbone.Model.extend({

    initialize: function(viewer){
        this.viewer = viewer;
        document.onmousemove = this.onmousemove.bind(this);
    },

    onmousemove: function(e){
        var viewport = this.viewer.getViewport();
        this.pos(
            e.pageX + viewport.x,
            e.pageY + viewport.y
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
            this.x = xy[0];
            this.y = xy[1];
            this.trigger('move', [this.x, this.y]);
        }else{
            return [this.x, this.y];
        }
    },
    inletPos: function(){
        return this.pos();
    }
});

module.exports = Mouse;
