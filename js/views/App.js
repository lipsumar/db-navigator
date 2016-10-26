var d3 = require('d3'),
    Backbone = require('backbone'),
    _ = require('underscore'),
    $ = Backbone.$,
    Viewer = require('./Viewer'),
    Mouse = require('../models/Mouse.js'),
    DBObjectModel = require('../models/DBObject.js'),
    DBListModel = require('../models/DBList.js'),
    DBObjectView = require('./DBObject.js'),
    DBListView = require('./DBList.js'),
    DBCable = require('./DBCable.js'),
    CreationMenu = require('./CreationMenu.js'),
    utilities = require('../utilities.js');


var App = Backbone.View.extend({
    initialize: function(opts){
        this.width = 1400;
        this.height = 800;
        this.tables = opts.tables;
        this.idAttribute = 'id';
        this.viewer = new Viewer();
        this.mouse = new Mouse(this.viewer);
        this.mouse.pos(this.viewer.width/2, this.viewer.height/2);
        this.creationMenu = new CreationMenu({
            tables: _.keys(this.tables)
        });
        this.creationMenu.on('chosen', this.creationMenuChosen.bind(this));
        this.viewer.append(this.creationMenu.render().el);
        this.objectCreationPos = [this.viewer.width/2-1000, this.viewer.height/2-300];
        this.$el.append(this.viewer.render().el);
    },

    events:{
        'mouseup': 'mouseup',
        'dblclick': 'dblclick'
    },

    // @TODO move to viewer
    mouseup: function(e){
        if(!$(e.target).hasClass('viewer__world')) return;

        if(this.mouseCable){

            this.openCreationMenu({
                pos: [e.offsetX, e.offsetY]
            });
        }
    },

    dblclick: function(e){
        this.openCreationMenu({
            pos: [e.offsetX, e.offsetY]
        });
    },

    setIdAttribute: function(idAttribute){
        this.idAttribute = idAttribute;
    },


    onContextMenu: function(){


        var slug = prompt('slug');
        this.createDBObject(slug, [d3.event.x, d3.event.y]);
        return false;
    },

    getNextObjectPosition: function(){
        this.objectCreationPos[0]+=400;
        this.objectCreationPos[1]+=100;
        return this.objectCreationPos;
    },


    createDBObject: function(slug, opts){
        opts = opts || {};
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

        var Model = slug._singleId ? DBObjectModel : DBListModel,
            model = new Model({
                table: slug.table,
                originField: slug.originField,
                id: slug.id
            }),
            View = slug._singleId ? DBObjectView : DBListView,
            view = new View({
                model: model,
                svg: this.svg
            });


        if(!opts.pos){
            opts.pos = this.getNextObjectPosition();
        }

        view.pos(opts.pos);

        this.listenTo(view, 'new-cable', this.onViewNewCable.bind(this));


        this.viewer.append(view.render().el);



        return view;
    },

    createDBCable: function(source, sourceField, target){
        var cable = new DBCable({
            source: source,
            sourceField: sourceField,
            target: target
        });
        this.viewer.append(cable.render().el);
        return cable;
    },

    onViewNewCable: function(dbobject, field){
        this.mouseCable = this.createDBCable(dbobject, field, this.mouse);
    },

    openCreationMenu: function(opts){
        this.creationMenu.pos(opts.pos);
        this.creationMenu.reset();
        this.creationMenu.show();
    },

    creationMenuChosen: function(table){
        if(this.mouseCable){
            var createdObject = this.createDBObject(table, {
                from: this.mouseCable.source,
                fromField: this.mouseCable.sourceField,
                pos: this.mouseCable.target.pos()
            });
            this.mouseCable.setTarget(createdObject);
            this.mouseCable = null;
        }
        this.creationMenu.hide();
    },

    render: function(){

    }
});

module.exports = App;
