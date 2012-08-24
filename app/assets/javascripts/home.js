Shelf.init = function(){
	this.initMain();
	this.SignUp.init();
	this.LogIn.init();
	this.AlbumShelf.init();
	this.GetYours.init();
};

Shelf.GetYours = {
	init:function(){
		this.form = $('form#get-yours');
		this.form.submit(this.submit.bind(this));
	},
	submit:function(){
		event.preventDefault();
		var discogs_username = $('input#discogs_username').val();
		var lastfm_username = $('input#lastfm_username').val();
		if (discogs_username || lastfm_username){
			Shelf.Logo.loading(true, 'Fetching...');
			$.get('/shelf',
				{lastfm_username:lastfm_username,discogs_username:discogs_username},
				this.process);
		}
		Shelf.SignUp.setLastFM(lastfm_username);
	},
	process:function(data){
		Shelf.SignUp.show();
		Shelf.AlbumShelf.populate(data);
	}
};

Shelf.LogIn = {
	init:function(){
		this.button = $('input#login');
		this.box = $('div#login-box');
		this.form = $('form#login');
		this.button.click(this.toggle.bind(this));
	},
	toggle:function(event){
		event.preventDefault();
		if (this.form.is(':visible'))
			this.form.slideUp();
		else this.form.slideDown();
	}
};

Shelf.SignUp = {
	init:function() {
		this.box = $('div#signup-box');
		this.form = $('form#signup');
		this.notice = $('div#empty');
		this.form.submit(this.submit.bind(this));
	},
	show:function(){
		this.form.slideDown();
	},
	submit:function() {
		//event.preventDefault();
		var email = this.form.find('input#user_email').val(),
		username = this.form.find('input#user_username').val(),
		password = this.form.find('input#user_password').val();
		
		if (email && username && password){
			console.log("hehe");
			//$.post(this.form.attr('action'),
			//	{email:email, username:username, password:password},
			//	this.process.bind(this));
		}else{
			this.notice.fadeIn();
			return false;
		}
	},
	process:function(data){
		this.box.html(data);
	},
	setLastFM:function(lastfm_username){
		this.form.find('input#user_lastfm_username').val(lastfm_username);
	}
};

