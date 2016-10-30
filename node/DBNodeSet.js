var async = require('async');

function DBNodeSet() {
    this.nodes = [];
    this.root = null;
    this.nextNId = 0;
}


DBNodeSet.prototype.add = function(node) {
    if(this.nodes.length === 0){
        this.root = node;
    }
    node.nId = this.nextNId;
    this.nextNId++;
    this.nodes.push(node);
};

DBNodeSet.prototype.execute = function(callback) {
    executeNodeRecursive.call(this, this.root, callback);
};

DBNodeSet.prototype.from = function(node) {
    return this.nodes.filter(function(n){
        return n.inlet && n.inlet.node.nId === node.nId;
    });
};

function executeNodeRecursive(node, callback){
    var self = this;
    node.execute(function(){
        var dependentNodes = self.from(node);
        if(dependentNodes.length > 0){
            console.log('found dependent nodes !');
            async.each(dependentNodes, executeNodeRecursive.bind(self), callback);

        }else{
            callback();
        }
    });
}

module.exports = DBNodeSet;
