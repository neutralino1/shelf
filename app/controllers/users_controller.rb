class UsersController < Devise::RegistrationsController
	def create
		user = User.new(:email => params[:email], 
			:password => params[:password], :username => params[:username])
		if user.save!
			sign_in(:user, user)
			render :text => "yeahhh"
		else
			raise "fuck"
		end
	end

	def show
		@albums = Album.find(:all, :order => 'RAND()', :limit => 16)
		render "home/index"
	end

end