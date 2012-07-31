require 'lastfm'
require 'goodreads'
require 'net/http'
require  'uri'

LASTFM_API_KEY = 'cc29f9738ebdf3a626c29500a0f3f88b'
LASTFM_API_SECRET = 'cb4b8e7e87face4d833b9ac4fd26c92c'

class Album < ActiveRecord::Base
	attr_accessible :title, :artist, :url, :service, :artwork

	def self.sync_lastfm
		lastfm = Lastfm.new(LASTFM_API_KEY, LASTFM_API_SECRET)
	#token = lastfm.auth.get_token
	#open 'http://www.last.fm/api/auth/?api_key=xxxxxxxxxxx&token=xxxxxxxx' and grant the application
	#lastfm.session = lastfm.auth.get_session(:token => token)['key']
		lastfm_albums = lastfm.user.get_top_albums(:user => 'bluesmanu', :limit => '200')
		lastfm_albums.each do |album|
			exist = Album.where(['title LIKE ? AND artist LIKE ?',"%#{album['name']}",
				"%#{album['artist']['name']}%"])
			if exist.empty?
				Album.create(
					:title => album['name'], 
					:artist => album['artist']['name'], 
					:service => 'lastfm',
					:artwork => album['image'][2]['content'],
					:url =>album['url'])
			end
		end
	end

	def self.sync_discogs
		uri = URI.parse('http://api.discogs.com/users/neutralino1/collection/folders/0/releases')
		response = Net::HTTP.get(uri)
		discogs_releases = JSON.parse(response)['releases'].map {|r| r['basic_information']}
		discogs_releases.each do |release|
			exist = Album.where(['title LIKE ? AND artist LIKE ?',
				"%#{release['title']}%","%#{release['artists'][0]['name']}%"])
			if exist.empty?
				Album.create(
					:title => release['title'],
					:artist => release['artists'][0]['name'],
					:service => 'discogs',
					:artwork => release['thumb'],
					:url => release['resource_url']
					)
			end
		end
	end

end
