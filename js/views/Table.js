var Backbone = require('backbone');

var Table = Backbone.View.extend({
    className: 'table',
    initialize: function(opts){
        this.rows = opts.rows;
        this.fields = opts.fields;
    },
    render: function(){
        var html = '<table cellpadding="0" cellspacing="0" border="0">';

        html+'<thead><tr>';
        this.fields.forEach(function(field){
            html+= '<th>'+field.name+'</th>';
        });
        html+'</tr></thead>';

        html+='<tbody>';
        var fields = this.fields;
        this.rows.forEach(function(row){
            html+='<tr>';
            fields.forEach(function(field){
                var valueString = row.get(field.name).toString();
                if(valueString.length > 30){
                    valueString = valueString.substring(0, 30)+'...';
                }
                html+='<td>'+valueString+'</td>';
            });
            html+='</tr>';
        });
        html+='</tbody>';

        html+='</table>';


        this.$el.html(html);

        return this;
    }
});


module.exports = Table;
