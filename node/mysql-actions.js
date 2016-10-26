var async = require('async');
var db;



function getTableDescription(table, callback){
    var desc = {};
    db.query('DESCRIBE '+table, function(err, rows) {
        if(err){
            callback(err);
            return;
        }
        desc.__fields = rows.map(function(r){
            return r.Field;
        });
        rows.forEach(function(r){
            desc[r.Field] = r;
            if(r.Key==='PRI'){
                desc.__PRI = r.Field;
            }
        });
        callback(null, desc);
    });
}


function getListCount(table, where, callback){
    db.query('SELECT COUNT(*) as total FROM '+table+' WHERE '+where, function(err, rows){
        if(err) callback(err);
        callback(null, rows[0].total);
    });
}

function getList(table, where, callback){
    db.query('SELECT * FROM '+table+' WHERE '+where, function(err, rows, fields){
        if(err) callback(err);
        callback(null, {
            rows:rows,
            fields: fields
        });
    });
}



module.exports = {

    setConnection: function(connection){
        db = connection;
    },

    tables:  function(callback){
        var tables = {};
        db.query('SHOW tables', function(err, rows, fields) {
            if (err) callback(err);
            async.each(rows, function(row, callback){
                var table = row[fields[0].name];
                getTableDescription(table, function(err, desc){
                    tables[table] = desc;
                    callback();
                });
            }, function(err){
                callback(err, tables);
            });

        });
    },

    list: function(table, field, value, callback){
        var where =  db.escapeId(field) + '=' + db.escape(value);

        async.parallel([
            getListCount.bind(null, table, where),
            getList.bind(null, table, where)
        ], function(err, results){
            if (err) callback(err);
            callback(null, {
                total: results[0],
                rows: results[1].rows,
                fields: results[1].fields
            });
        });

    },

    model: function(table, field, value, callback){
        var where =  db.escapeId(field) + '=' + db.escape(value);
        db.query('SELECT * FROM '+table+' WHERE '+where+' LIMIT 1', function(err, rows){
            if (err) callback(err);
            callback(null, rows[0]);
        });
    }


};


