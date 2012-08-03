class SessionsController < Devise::SessionsController
	def destroy
		sign_out(current_user)
		redirect_to root_path
	end
end