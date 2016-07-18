var Backbone = require('backbone');


var DBObjectListModel = Backbone.Model.extend({
	urlRoot: function(){
		return 'php/index.php?cmd=list&table='+this.parsedSlug.table+'&originField='+this.parsedSlug.originField+'&originValue='+this.parsedSlug.originValue;
	},
	initialize: function(opts){
		this.parsedSlug = opts.parsedSlug;
		this.fetch();
	}
});

module.exports = DBObjectListModel;