function DBNodeOutlet(opts){
    this.node = opts.node;
    this.field = opts.field;
}

DBNodeOutlet.prototype.full = function(callback) {
    this.node.getFullColumn(this.field, callback);
};

DBNodeOutlet.prototype.asSlug = function() {
    return this.node.slug()+'->'+this.field;
};

module.exports = DBNodeOutlet;
