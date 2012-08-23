class AlbumsController < ApplicationController
	def index
		render json: current_user.albums.find(:all, :limit => 1000)
	end
end