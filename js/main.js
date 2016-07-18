var Backbone = require('backbone'),
    d3 = require('d3'),
    $ = require('jquery');
var DBObject = require('./dbobject.js');
var DBObjectList = require('./dbobjectList.js');


function parseSlug(slug){
    var parsed = {};
    var slugParts = slug.split('/');
    parsed.table = slugParts[0];
    var id = slugParts[1];
    if(id && id[0]===':'){
        parsed.originField = id.substr(1);
        parsed.originValue = slugParts[2];
        parsed._singleId = false;
    }else{
        parsed.id = id;
        parsed._singleId = true;
    }
    return parsed;
}


var App = Backbone.View.extend({
    initialize: function(opts){
        this.width = 1400;
        this.height = 800;
        this.tables = opts.tables;


        this.svg = d3.select("body").append("svg")
            .attr("width", this.width)
            .attr("height", this.height);

        this.zoom = d3.zoom().on('zoom', function(e){
            this.svg.attr("transform", d3.event.transform);
        }.bind(this));

        this.svg = this.svg.call(this.zoom).append('g');

    },

    /*events:{
        'mouseup svg': 'svgMouseup'
    },



    svgMouseup: function(e){
        var target = e.target;

        var slug = prompt('slug',[e.pageX, e.pageY]);
        this.createDBObject(slug, [e.pageX, e.pageY]);

    },*/


    createDBObject: function(slug, pos){
        var parsedSlug = parseSlug(slug);
        var dbObject;
        if(parsedSlug._singleId){
            dbObject = new DBObject({
                x: pos[0],
                y: pos[1],
                svg: this.svg,
                parsedSlug: parsedSlug
            });
        }else{
            dbObject = new DBObjectList({
                x: pos[0],
                y: pos[1],
                svg: this.svg,
                parsedSlug: parsedSlug
            });
        }

        dbObject.render();
        return dbObject;
    }
});



$.getJSON('php/index.php?cmd=tables', function(resp){
    window.app = new App({
        el: document.body,
        tables: resp.tables
    });
    window.app.createDBObject('ibouf_tables/1', [200, 200]);
});


