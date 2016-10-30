var mysqlActions = require('./mysql-actions.js');
var DBNodeOutlet = require('./DBNodeOutlet.js');

function DBNode(opts){
    this.table = opts.table;
    this.field = opts.field;
    this.value = opts.value;
    this.db = opts.db;
    this.outlets = {};
    if(opts.from){
        this.inlet = opts.from;
    }
}


DBNode.prototype.execute = function(callback) {
    console.log(this.slug()+' execute');
    fetch.call(this, callback);
};

DBNode.prototype.outlet = function(field) {
    if(!this.outlets[field]){
        this.outlets[field] = new DBNodeOutlet({
            field: field,
            node: this
        });
    }
    return this.outlets[field];
};

DBNode.prototype.getFullColumn = function(field, callback) {
    var self = this;
    if(this.inlet){
        this.inlet.full(f);
    }else{
        f(null, [this.value]);
    }

    function f(err, arr){
        var q = 'SELECT '+self.db.escapeId(field)+' FROM '+self.table+ ' WHERE '+self.field+' IN ('+mysqlActions.arrayToIn(arr)+')';
        self.db.query(q, function(err, rows){
            var column = rows.map(function(row){
                return row[field];
            });
            callback(null, column);
        });
    }
};

DBNode.prototype.slug = function() {
    var valueSlug = this.value || '('+this.inlet.asSlug()+')';
    return this.table+'/'+this.field+'/'+valueSlug;
};




function fetch(callback){
    var self = this;
    if(this.inlet){
        this.inlet.full(f);
    }else{
        f(null, [this.value]);
    }

    function f(err, arr){
        mysqlActions.listIn(self.table, self.field, arr, function(err, res){
            if(err) throw err;
            self.total = res.total;
            self.rows = res.rows;
            self.fields = res.fields;
            console.log('fetched '+self.slug());
            console.log(self.rows);
            callback && callback(null);
        });
    }
}







module.exports = DBNode;
