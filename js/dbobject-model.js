var Backbone = require('backbone');


var DBObjectModel = Backbone.Model.extend({
	urlRoot: function(){
		return 'php/index.php?cmd=model&table='+this.parsedSlug.table+'&id='+this.parsedSlug.id;
	},
	initialize: function(opts){
		this.parsedSlug = opts.parsedSlug;
		this.fetch();
	}
});

module.exports = DBObjectModel;