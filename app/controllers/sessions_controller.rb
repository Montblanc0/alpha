class SessionsController < ApplicationController
  include FlashHelper
  before_action :redirect_and_notify, only: %i[new]

  def new; end

  def create
    ## case-sensitive lookup
    # user = User.find_by(username: params[:username])
    ## case-insensitive lookup
    user = User.where('LOWER(username) = ?', params[:username].downcase).take
    if user&.authenticate(params[:password])
      session[:user_id] = user.id
      flash[:notice] = "Welcome back, #{user}!"
      redirect_to posts_url
    else
      respond_to do |format|
        flash.now[:alert] = 'Login failed: invalid username and/or password'
        format.turbo_stream { render turbo_stream: render_turbo_flash }
        format.html { redirect_to '/login', status: 404, alert: 'Login failed: invalid username and/or password' }
      end
    end
  end

  def destroy
    session[:user_id] = nil
    reset_session
    redirect_to posts_url, notice: 'Logged Out. Goodbye!'
  end

  private

  def redirect_and_notify
    if current_user
      respond_to do |format|
        format.turbo_stream do
          flash.now[:alert] = 'You are already logged in.'
          render turbo_stream: render_turbo_flash
        end
        format.html { redirect_to posts_url, alert: 'You are already logged in.' }
      end
    end
  end
end
