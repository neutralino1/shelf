require 'goodreads'

GR_API_KEY = 'l5C9dlafUhQuEAAkdhg'
GR_API_SECRET ='Y2Tl7Q6dYMf73lrjWgGZXl9cqDPP07jMVDlsP8Dks'

class HomeController < ApplicationController
  def index

	#Album.sync_lastfm
	#Album.sync_discogs

	@albums = Album.find(:all, :order => 'RAND()', :limit => 8)

	#client = Goodreads.new(:api_key => GR_API_KEY)
	#updates = client.user('10997557').updates[0..7]
	#@books = updates.map {|u| client.book(u.object.book.id) }
  end
end
