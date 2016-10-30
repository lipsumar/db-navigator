var DBNode = require('./DBNode.js'),
    DBNodeSet = require('./DBNodeSet.js');
var db,
    nodes = [];


var api = {

    init: function(opts){
        db = opts.db;
        nodes = new DBNodeSet();
    },

    createDBNode: function(opts){
        opts.db = db;
        var node = new DBNode(opts);
        nodes.add(node);
        return node;
    },

    execute: function(callback){
        nodes.execute(callback);
    }



};

module.exports = api;
