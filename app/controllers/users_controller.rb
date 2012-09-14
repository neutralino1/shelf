class UsersController < Devise::RegistrationsController
	def create
		user = User.new(params[:user])
		if user.save!
			sign_in(:user, user)
			user.sync_albums(100)
			redirect_to root_path
		else
			raise "fuck"
		end
	end

	def show
#		@albums = current_user.albums.find(:all, :limit => 48) #sync_albums
		#@albums = Album.find(:all, :order => 'RAND()', :limit => 16)
	end

	def albums
		if params[:sync] == "1"
			limit = current_user.albums.count > 0 ? 200 : 32
			current_user.sync_albums(limit)
		end
		@order = params[:order] ? params[:order] : 'created_at'
		@albums = current_user.albums.find(:all, :limit => 1000, :order => "#{@order} desc")
		render :partial => 'home/albums'
	end

	def bbalbums
		render json: current_user.albums.find(:all, :limit => 1000)
	end

end