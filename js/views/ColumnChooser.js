var Backbone = require('backbone');


var ColumnChooser = Backbone.View.extend({
    initialize: function(opts){
        this.columns = opts.columns;
        this.chosenColumns = opts.chosenColumns;
        this.sourceBBox = opts.source.node().getBoundingClientRect();//cache bbox, that element will disappear
        this.listenTo(window.app, 'zoom', this.remove.bind(this));
        this.on('toggle', this.render.bind(this));
    },

    toggleColumn: function(field){
        if(this.chosenColumns.indexOf(field) > -1){
            // remove
            this.chosenColumns.splice(this.chosenColumns.indexOf(field), 1);
        }else{
            // add
            this.chosenColumns.push(field);
        }
        this.trigger('toggle', this.chosenColumns);
    },

    render: function(){
        var self = this;
        var bbox = this.sourceBBox;
        if(this.el){
            this.el.remove();
        }

        var el = window.app.rootSvg.append('g')
            .attr('transform', 'translate('+bbox.left+','+(bbox.top+bbox.height)+')');

        var chosen = this.chosenColumns;
        this.columns.forEach(function(field, i){
            el.append('rect')
                .attr('y', 20*i)
                .attr('width', 200)
                .attr('height', 22)
                .attr('fill','lightgreen')
                .on('click', function(){
                    self.toggleColumn(field);
                });
            el.append('text')
                .attr('y', 15 + 20*i)
                .attr('x', 20)
                .attr('pointer-events', 'none')
                .text(field);

            if(chosen.indexOf(field) > -1){
                el.append('text')
                    .attr('width', 200)
                    .attr('height', 22)
                    .attr('y', 16 + 20*i)
                    .attr('x', 3)
                    .attr('pointer-events', 'none')
                    .text('✔');
            }
        });


        this.el = el;
        return this;
    },

    remove: function(){
        Backbone.View.prototype.remove.apply(this, arguments);
        this.el.remove();
    }
});

module.exports = ColumnChooser;
