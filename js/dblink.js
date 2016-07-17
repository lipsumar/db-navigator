var Backbone = require('backbone');
var d3 = require('d3');

// d3.transform(String).translation seems to be gone in v4 :(
function getTranslation(transform) {
  // Create a dummy g for calculation purposes only. This will never
  // be appended to the DOM and will be discarded once this function
  // returns.
  var g = document.createElementNS("http://www.w3.org/2000/svg", "g");

  // Set the transform attribute to the provided string value.
  g.setAttributeNS(null,"transform", transform);

  // consolidate the SVGTransformList containing all transformations
  // to a single SVGTransform of type SVG_TRANSFORM_MATRIX and get
  // its SVGMatrix.
  var matrix = g.transform.baseVal.consolidate().matrix;

  // As per definition values e and f are the ones for the translation.
  return [matrix.e, matrix.f];
}



var DBLink = Backbone.View.extend({
	initialize: function(opts){
		this.svg = opts.svg;
		this.target = opts.target;
		this.source = opts.source;
		this.sourceEl = opts.sourceEl;
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
	render: function(){
		var sourceElBBox = this.sourceEl.getBBox();
		var sourceBlockBBox = this.source.el.node().getBBox();

		var y = getTranslation(this.sourceEl.parentNode.getAttribute('transform'))[1];

		var srcPos = this.source.pos();
		var sourcePos = [srcPos[0]+10+sourceElBBox.x, srcPos[1]+40+y+4];

		var targetPos;
		if(this.target.pos){
			// target is a DBObject
			targetPos = this.target.pos();
		}else{
			// target is an array
			targetPos = this.target;
			var sourceBlockY = getTranslation(this.source.el.attr('transform'))[1];
			var sourceBlockX = getTranslation(this.source.el.attr('transform'))[0];
			targetPos[1]+=sourceBlockY + 40 + y;
			targetPos[0]+=sourceBlockX;
		}


		var bezOffset = (targetPos[0] - sourcePos[0])/2;
		var path = d3.path();
		path.moveTo(sourcePos[0], sourcePos[1]);
		path.bezierCurveTo(sourcePos[0]+bezOffset,sourcePos[1], targetPos[0]-bezOffset,targetPos[1], targetPos[0], targetPos[1]);
		this.el.attr('d', path.toString());
	}
});

module.exports = DBLink;