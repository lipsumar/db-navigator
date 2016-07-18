var Backbone = require('backbone');
var DBLink = require('./dblink.js');
var DBObjectModel = require('./dbobject-model.js');
var d3 = require('d3');


var DBObject = Backbone.View.extend({
	initialize: function(opts){
		this.svg = opts.svg;
		this.pos(opts.x, opts.y);
		this.width = 200;
		this.height = 100;

		this.model = new DBObjectModel({
			parsedSlug: opts.parsedSlug
		});
		this.model.on('sync', this.render.bind(this));

		this.build();
	},

	pos: function(){
		if(arguments.length === 2){
			this.x = arguments[0];
			this.y = arguments[1];
			this.trigger('move');
		}else{
			return [this.x, this.y];
		}
	},


	outletStartDrag: function(){
		var outletEl = arguments[2][0];
		var col = outletEl.getAttribute('data-col');
		var i = outletEl.getAttribute('data-i');
		var link = new DBLink({
			source: this,
			sourceOffset: [this.width, 40 + 20*i],
			sourceCol: col,
			svg: this.svg
		});
		this.currentLink = link;
	},
	outletDrag: function(){
		var pos = [
			this.x + d3.event.x,
			this.y + d3.event.y + 8
		];
		this.currentLinkTargetPos = pos;
		this.currentLink.render(pos);
	},
	outletEndDrag: function(){
		var targetTable = prompt('table?');
        var id = this.currentLink.source.model.get('row')[this.currentLink.sourceCol];
        var dbo = window.app.createDBObject(targetTable+'/'+id, this.currentLinkTargetPos);
        this.currentLink.setTarget(dbo);
	},

	build: function(){
		this.el = this.svg.append('g')
			.attr('class', 'dbobject');

		this.container = this.el.append('rect');

		this.originFieldEl = this.el.append('rect')
			.attr('class', 'origin');
		this.originFieldText = this.el.append('text')
			.attr('class', 'originText')
			.text('id');

		this.dragHandle = this.svg.append('rect')
			.attr('transform', 'translate('+this.x+','+(this.y-13)+')')
			.attr('class', 'dragHandle');
		this.dragHandle.call(d3.drag()
			.on('drag', function(e){
				this.el.attr('transform', 'translate('+(d3.event.x)+','+(d3.event.y+7)+')');
				this.dragHandle.attr('transform', 'translate('+(d3.event.x)+','+(d3.event.y-21+7)+')');
				this.pos(d3.event.x,d3.event.y);
			}.bind(this)
		));

		this.tableTitle = this.el.append('text')
			.attr('class', 'tabletitle')
			.text(this.model.parsedSlug.table);

		var colsG = this.el.append('g').attr('class', 'columns');
		var columns = window.app.tables[this.model.parsedSlug.table].__fields;
		columns.forEach(function(col, i){
			var colG = colsG.append('g')
				.attr('transform','translate(0, '+(i*20)+')')
				.attr('data-col', col);
			colG.append('text').text(col);
			colG.append('text')
				.attr('class', 'value')
				.attr('x', this.width-20)
				.attr('text-anchor', 'end');

			var target = this.el.append('rect')
				.attr('class', 'outlet')
				.attr('x', this.width-5)
				.attr('y', i*20 + 30)
				.attr('width', 10)
				.attr('height', 10)
				.attr('data-i', i)
				.attr('data-col', col);

			target.call(d3.drag()
				.on('start', this.outletStartDrag.bind(this))
				.on('drag', this.outletDrag.bind(this))
				.on('end', this.outletEndDrag.bind(this))
			);

			target.node().view = this;
			if(i>2){
				this.height+=20;
			}
		}.bind(this));
	},



	render: function(){
		this.el.attr('transform', 'translate('+this.x+','+(this.y+8)+')');
		this.container
			.attr('width', this.width)
			.attr('height', this.height);

		var row = this.model.get('row');
		if(row){
			Object.keys(row).forEach(function(col){
				var valLength = row[col].toString().length;
				var val = row[col];
				if(valLength > 9){
					val = val.substr(0,9) + '…';
				}
				this.el.select('g[data-col="'+col+'"] text.value').text(val);
			}.bind(this));

		}
	}
});

module.exports = DBObject;
