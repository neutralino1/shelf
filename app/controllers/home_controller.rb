require 'goodreads'

GR_API_KEY = 'l5C9dlafUhQuEAAkdhg'
GR_API_SECRET ='Y2Tl7Q6dYMf73lrjWgGZXl9cqDPP07jMVDlsP8Dks'

class HomeController < ApplicationController

	def index
#		raise "/#{current_user.username}".inspect
	  	return	redirect_to "/#{current_user.username}" if user_signed_in?
		@user = User.new

		@albums = Album.find(:all, :order => 'RAND()', :limit => 16)

		#client = Goodreads.new(:api_key => GR_API_KEY)
		#updates = client.user('10997557').updates[0..7]
		#@books = updates.map {|u| client.book(u.object.book.id) }
  	end

  	def shelf
  		@albums = Album.get_lastfm_albums(params[:lastfm_username], 32)
  		render :partial => 'albums'
  	end
end
