var Backbone = require('backbone');


var DBObjectModel = Backbone.Model.extend({
	urlRoot: function(){
		return 'php/index.php?cmd=model&table='+this.table+'&id='+this.id;
	},
	initialize: function(opts){
		this.resolveSlug(opts.slug);
		this.fetch();
	},
	resolveSlug: function(slug){
		var slugParts = slug.split('/');
		this.table = slugParts[0];
		this.id = slugParts[1];
	}
});

module.exports = DBObjectModel;