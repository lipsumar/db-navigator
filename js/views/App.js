var d3 = require('d3'),
    Backbone = require('backbone'),
    DBObjectModel = require('../models/DBObject.js'),
    DBObjectListModel = require('../models/DBObjectList.js'),
    DBObjectView = require('./DBObject.js'),
    DBObjectListView = require('./DBObjectList.js'),
    utilities = require('../utilities.js');


var App = Backbone.View.extend({
    initialize: function(opts){
        this.width = 1400;
        this.height = 800;
        this.tables = opts.tables;
        this.idAttribute = 'id';

        this.svg = this.createSvg(this.width, this.height);

        this.svg.on('contextmenu', this.onContextMenu.bind(this));

    },

    /*events:{
        'mouseup svg': 'svgMouseup'
    },*/

    setIdAttribute: function(idAttribute){
        this.idAttribute = idAttribute;
    },


    onContextMenu: function(){
        d3.event.preventDefault();

        var slug = prompt('slug');
        this.createDBObject(slug, [d3.event.x, d3.event.y]);
        return false;
    },


    createDBObject: function(slug, opts){
        //console.log(slugString, utilities.parseSlug(slugString));
        slug = typeof slug === 'string' ? utilities.parseSlug(slug) : slug;

        if(slug._invalid) return;

        if(opts.from){
            var model = opts.from.model;
            if(model.synced){
                slug.id = model.getValueAsString(opts.fromField);
            }else{
                model.once('sync', this.createDBObject.bind(this, slug, opts));
                return;
            }
        }

        var Model = slug._singleId ? DBObjectModel : DBObjectListModel,
            model = new Model({
                table: slug.table,
                originField: slug.originField,
                id: slug.id
            }),
            View = slug._singleId ? DBObjectView : DBObjectListView,
            view = new View({
                model: model,
                svg: this.svg
            });

        if(opts.pos){
            view.pos(opts.pos);
        }

        view.render();
        //this.svg.node().appendChild(el.node());

        return view;
    },

    createSvg: function(width, height){
        var svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height);

        this.rootSvg = svg;

        svg.append("defs")
            .append('pattern')
                .attr('id', 'gridpattern')
                .attr('patternUnits', 'userSpaceOnUse')
                .attr('width', 150)
                .attr('height', 150)
                .append("image")
                    .attr("xlink:href", "images/noisy_grid.png")
                    .attr('width', 150)
                    .attr('height', 150);

        // apply zoom
        var zoom = d3.zoom()
            .on('zoom', function(){
                svg.attr("transform", d3.event.transform);
                this.trigger('zoom');
            }.bind(this));
        svg = svg.call(zoom).append('g');

        // draw a grey "workspace" - purely styling
        svg.append('rect')
            .attr('class','background')
            .attr('fill', 'url(#gridpattern)')
            .attr('width', 9000)
            .attr('height', 9000)
            .attr('x', -5000)
            .attr('y', -5000);


        return svg;
    }
});

module.exports = App;
