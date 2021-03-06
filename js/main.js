var $ = require('jquery'),
    App = require('./views/App');


$.getJSON('php/index.php?cmd=tables', function(resp){
    window.app = new App({
        el: document.body,
        tables: resp.tables
    });

    // for dev only
    //window.app.createDBObject('ibouf_users/1', [200, 200]);
    //window.app.createDBObject('ibouf_users/:table_id/2', [100, 200]);

    window.app.setIdAttribute('uid');
    window.app.createDBObject('t_users/3', [100, 100]);
});
