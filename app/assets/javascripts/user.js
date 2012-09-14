

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
			year: 1900,
			initialize: function(){
				this.date = new Date(this.get('release_date'));
				this.year = this.date.getFullYear();
			}
		});

		Shelf = Backbone.Collection.extend({
			model: Album,
			url: '/users/albums',
			initialize: function (models, options) {
			},
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
				this.vent.bind('changeOrder', this.changeOrder.bind(this));
				this.collection.fetch({success: function(){
					this.vent.trigger("quiet", this.model);
				}.bind(this)});
			},
			render: function(){
				this.$el.html(this.template({abc: 'abc', albums: this.collection.toJSON()}));
			},
			changeOrder: function(){
				this.collection.comparator = function (album) {
					console.log(album.get("release_date"));
  					return album.get("release_date");
				};
				this.collection.sort();
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
			initialize: function(options){
				console.log(this.$el);
				this.vent = options.vent;
			},
			changeOrder: function(){
				this.vent.trigger('changeOrder');
			}
		});

		var vent = _.extend({}, Backbone.Events);
		var logoview = new LogoView({vent: vent});
		var shelfview = new ShelfView({vent: vent});
		var settingsview = new SettingsView({vent: vent});
	});
