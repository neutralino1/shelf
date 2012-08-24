require 'lastfm'
require 'goodreads'
require 'net/http'
require  'uri'

LASTFM_API_KEY = 'cc29f9738ebdf3a626c29500a0f3f88b'
LASTFM_API_SECRET = 'cb4b8e7e87face4d833b9ac4fd26c92c'

class Album < ActiveRecord::Base
	attr_accessible :title, :artist, :url, :service, :artwork, :release_date

	has_and_belongs_to_many :users

	def self.get_lastfm_albums(username, limit)
		lastfm = Lastfm.new(LASTFM_API_KEY, LASTFM_API_SECRET)
		lastfm_albums = lastfm.user.get_top_albums(:user => username, :limit => limit)
		return lastfm_albums.map do |album|
			Album.new(
				:title => album['name'], 
				:artist => album['artist']['name'], 
				:service => 'lastfm',
				:artwork => album['image'][2]['content'],
				:url =>album['url'])
		end
	end

	def self.sync_lastfm
		albums = get_lastfm_albums
		albums.each do |album|
			exist = Album.where(['title LIKE ? AND artist LIKE ?',"%#{album['name']}",
				"%#{album['artist']['name']}%"])
			if exist.empty?
				album.save!
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
