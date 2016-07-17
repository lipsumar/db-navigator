var Backbone = require('backbone');
var d3 = require('d3');



var DBLink = Backbone.View.extend({
	initialize: function(opts){
		this.svg = opts.svg;
		this.source = opts.source;
		this.sourceOffset = opts.sourceOffset;
		this.targetOffset = opts.targetOffset;
		this.sourceCol = opts.sourceCol;
		this.source.on('move', this.render.bind(this));
		this.build();
	},
	setTarget: function(target){
		this.target = target;
		this.target.on('move', this.render.bind(this));
	},
	build: function(){
		console.log('build');
		this.el = this.svg.append('path')
			.attr('class', 'link');
	},
	render: function(trgPos){

		var srcPos = this.source.pos();
		trgPos = trgPos || this.target.pos();

		var sourcePos = [srcPos[0]+this.sourceOffset[0], srcPos[1]+this.sourceOffset[1]];
		var targetPos = [trgPos[0]+this.targetOffset[0], trgPos[1]+this.targetOffset[1]];


		var bezOffset = (targetPos[0] - sourcePos[0])/2;
		var path = d3.path();
		path.moveTo(sourcePos[0], sourcePos[1]);
		path.bezierCurveTo(sourcePos[0]+bezOffset,sourcePos[1], targetPos[0]-bezOffset,targetPos[1], targetPos[0], targetPos[1]);
		this.el.attr('d', path.toString());
	}
});

module.exports = DBLink;