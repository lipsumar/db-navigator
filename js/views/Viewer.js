var Backbone = require('backbone'),
    $ = Backbone.$;



var Viewer = Backbone.View.extend({
    className: 'viewer',
    initialize: function(){
        this.width = 10000;
        this.height = 10000;
        this.build();
    },


    build: function(){
        this.$world = $('<div class="viewer__world"></div>');
        this.$world.css({
            width: this.width,
            height: this.height,
        });
        this.$el.append(this.$world);
        setTimeout(this.center.bind(this), 10);
    },

    getCenterPosition: function(){
        return [this.width/2, this.height/2];
    },

    getViewport: function(){
        return {
            x: this.$el.scrollLeft(),
            y: this.$el.scrollTop()
        };
    },

    center: function(){
        this.$el.scrollTop(this.height/2 - this.$el.height()/2);
        this.$el.scrollLeft(this.width/2 - this.$el.width()/2);
    },

    append: function(el){
        this.$world.append(el);
    }
});

module.exports = Viewer;
