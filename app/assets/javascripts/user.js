

Shelf.init = function(){
	this.initMain();
	//this.User.init();
	//BB.init();
};

Shelf.User = {
	init:function(){
		Shelf.Logo.loading(true, 'Loading...');
		Shelf.AlbumShelf.refresh({sync:0});
		this.Settings.init();
	},
};

Shelf.User.Settings = {
	init:function(){
		this.panel = $('div#control-panel');
		this.Order.init();
	},
	hide:function(){
		this.panel.hide('slide', {direction: 'left'}, 2000);
	},
};

Shelf.User.Settings.Order = {
	init:function(){
		this.orderRadio = $('input[name=order]');
		this.orderRadio.change(this.change);
	},
	change:function(event){
		//Shelf.User.Settings.hide();
		Shelf.AlbumShelf.order($(event.target).val());
	}
};

$(document).ready(
	function () {
		Album = Backbone.Model.extend({
			jsonRoot: 'album',
  			urlRoot: '/albums',
  			model_name: 'album',
			year: "123456",
			initialize: function(){
			}
		});

		Shelf = Backbone.Collection.extend({
			model: Album,
			url: '/users/albums',
			initialize: function (models, options) {
			},
			length: function(){ return "fuck";}
		});

		ShelfView = Backbone.View.extend({
			el: $("div#album-shelf"),
			template: window.JST['templates/shelf'],
			initialize: function (options) {
				this.vent = options.vent;
				this.collection = new Shelf;
				this.vent.trigger("loading", this.model);
				//this.collection.bind('reset', this.render.bind(this));
				this.collection.on('reset', this.render, this);
				this.collection.fetch({success: function(){
					this.vent.trigger("quiet", this.model);
				}.bind(this)});
			},
			render: function(){
				this.$el.html(this.template({abc: 'abc', albums: this.collection.toJSON()}));
			}
		});

		LogoView = Backbone.View.extend({
			el: $("h1#logo"),
			initialize: function(options){
				options.vent.bind("loading", this.loading.bind(this));
				options.vent.bind("quiet", this.quiet.bind(this));
			},
			loading: function(){
				this.$el.addClass('pulsate');
				this.$el.html('Loading...');
			},
			quiet: function(){
				this.$el.removeClass('pulsate');
				this.$el.html('Shelf');
			}
		});

		SettingsView = Backbone.View.extend({
			el: $('div#control-panel'),
			events: {
				'change input[name=order]' : 'changeOrder'
			},
			initialize: function(){
				console.log(2);
				console.log(this.$el);
			},
			changeOrder: function(){
				console.log(1);
			}
		});

		var vent = _.extend({}, Backbone.Events);
		var logoview = new LogoView({vent: vent});
		var shelfview = new ShelfView({vent: vent});
		var settingsview = new SettingsView;
	});
