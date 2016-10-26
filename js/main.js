var $ = require('jquery'),
    App = require('./views/App');


$.getJSON('node/db/tables', function(resp){
    window.app = new App({
        el: document.body,
        tables: resp.tables
    });
    window.app.render();

    // for dev only
    //window.app.createDBObject('ibouf_users/1', [200, 200]);
    //window.app.createDBObject('ibouf_users/:table_id/2', [100, 200]);

    window.app.setIdAttribute('uid');
    var cartman = window.app.createDBObject('t_users/3');
    var carts = window.app.createDBObject('t_stuff/:user_id/3');
    window.app.createDBCable(cartman, 'uid', carts);
    /*window.app.createDBObject('t_users/:user_id', {
        source: cartman,
        sourceField: 'uid'
    });
    /*window.app.createDBObject('t_stuff/:user_id', {
        from: cartman,
        fromField: 'uid'
    });
    window.app.createDBObject('t_stuff/:user_id/4', {pos:[100, 250]});*/
});
