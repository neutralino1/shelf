require 'lastfm'

LASTFM_API_KEY = 'cc29f9738ebdf3a626c29500a0f3f88b'
LASTFM_API_SECRET = 'cb4b8e7e87face4d833b9ac4fd26c92c'

class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :encryptable, :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :username, :password, :password_confirmation, :remember_me, :lastfm_username
  # attr_accessible :title, :body

  has_and_belongs_to_many :albums

  def sync_albums(limit)
  	lastfm = Lastfm.new(LASTFM_API_KEY, LASTFM_API_SECRET)
	lastfm_albums = lastfm.user.get_top_albums(:user => lastfm_username, :limit => limit)
	lastfm_albums.each do |album|
		exist = Album.where(['title LIKE ? AND artist LIKE ?',"%#{album['name']}",
				"%#{album['artist']['name']}%"])
		if exist.empty?
			album_info = lastfm.album.get_info(:artist => album['artist']['name'], :album => album['name'])
			exist = Album.create(
						:title => album_info['name'], 
						:artist => album_info['artist'], 
						:service => 'lastfm',
						:artwork => album_info['image'][2]['content'],
						:url =>album_info['url'],
						:release_date => album_info['releasedate'])
		else
			exist = exist[0]
		end
		unless self.albums.include?(exist)
			self.albums << exist
		end
	end
  end
end
