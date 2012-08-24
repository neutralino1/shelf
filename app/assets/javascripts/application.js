// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require jquery.ui.all
//= require underscore/underscore
//= require backbone/backbone
//= require_tree ./templates

Shelf = {
	initMain:function(){
		this.Logo.init();
		this.AlbumShelf.init();
	},
};

Shelf.AlbumShelf = {
	init:function(){
		this.albumShelf = $('div#album-shelf');
	},
	populate:function(data){
		Shelf.Logo.loading(false);
		this.albumShelf.html(data);
	},
	refresh:function(options){
		$.get('/users/albums', options, this.populate.bind(this));
	},
	order:function(order){
		Shelf.Logo.loading(true, 'Sorting...');
		this.refresh({order:order});
	}
};

Shelf.Logo = {
	init:function(){
		this.logo = $('h1#logo');
	},
	loading:function(on, message){
		if(on) {
			this.logo.addClass('pulsate');
			this.logo.html(message);
		}
		else {
			this.logo.removeClass('pulsate');
			this.logo.html('Shelf');
		}
	},
};

$(document).ready(function(){
	Shelf.init();
});

