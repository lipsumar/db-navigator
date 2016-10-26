var express = require('express'),
    app = express(),
    mysqlActions = require('./mysql-actions');


// Routes
// Routes - static
app.use(express.static('.'));
//app.use('/node_modules',express.static('node_modules'));


var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    port     : 8889,
    user     : 'root',
    password : 'root',
    database : 'db-nav-test'
});

connection.connect();

mysqlActions.setConnection(connection);


app.get('/node/db/tables', function(req, res){

    mysqlActions.tables(function(err, resp){
        if(err) throw err;
        res.end(JSON.stringify({
            tables: resp
        }));
    });

});

app.get('/node/db/list', function(req, res){
    mysqlActions.list(req.query.table, req.query.originField, req.query.originValue, function(err, resp){
        if(err) throw err;
        res.end(JSON.stringify({
            countTotal: resp.total,
            rows: resp.rows,
            fields: resp.fields
        }));
    });
});

app.get('/node/db/model', function(req, res){
    mysqlActions.model(req.query.table, req.query.field, req.query.value, function(err, resp){
        if(err) throw err;
        res.end(JSON.stringify(resp));
    });
});

app.listen(8877);
