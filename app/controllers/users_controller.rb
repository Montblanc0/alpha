class UsersController < ApplicationController
  include RecordHelper
  include FlashHelper
  include ModalHelper
  before_action :set_user, except: %i[new create]
  before_action :confirm_auth, only: %i[edit edit_username edit_password update destroy]
  rescue_from ActiveRecord::RecordNotFound, with: :catch_not_found

  # GET /users/1 or /users/1.json
  def show
    @posts = @user.posts.by_recently_updated.page(@page).without_count
  end

  # GET /users/new
  def new
    @user = User.new
  end

  # GET /users/1/edit
  def edit; end

  # POST /users or /users.json
  def create
    @user = User.new(user_params)

    respond_to do |format|
      if @user.save
        format.html { redirect_to posts_url, notice: 'User was successfully created. You can login now!' }
        format.json { render :show, status: :created, location: @user }
      else
        format.turbo_stream do
          flash.now[:alert] = 'User was not created: check fields with errors'
          render turbo_stream: [
            turbo_stream.update('turbo-frame-signup', partial: 'users/form', locals: { user: @user }),
            # render_turbo_flash_with(@user)
            render_turbo_flash
          ]
        end
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /users/1 or /users/1.json
  def update
    respond_to do |format|
      if @user.update(user_params)
        flash.now[:notice] = 'User was successfully updated.'
        format.turbo_stream do
          render turbo_stream: [render_turbo_flash,
                                turbo_stream.update('user-edit', partial: 'users/edit_profile')]
        end
        format.html { render :edit, status: :ok, notice: 'User was successfully updated.' }
        format.json { render :show, status: :ok, location: @user }
      else
        flash.now[:alert] = 'User was not updated:'
        format.turbo_stream do
          user_with_errors = @user
          set_user
          render turbo_stream: [render_turbo_flash_with(user_with_errors),
                                turbo_stream.update('user-edit', partial: 'users/edit_profile')]
        end
        format.html { render :edit, status: :unprocessable_entity, alert: 'User was not updated.' }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /users/1 or /users/1.json
  def destroy
    @user.destroy

    respond_to do |format|
      format.html do
        session[:user_id] = nil
        reset_session
        redirect_to posts_url, notice: 'User was successfully destroyed.'
      end
      format.json { head :no_content }
    end
  end

  def prompt
    show_modal(@user)
  end

  def show_posts
    @page = params[:page] || 1
    @posts = @user.posts.by_recently_updated.page(@page).without_count
    respond_to do |format|
      format.turbo_stream
      format.html { render partial: 'users/user_posts', status: :ok, locals: { posts: @posts } }
    end
  end

  def show_messages
    @page = params[:page] || 1
    @messages = @user.messages.by_recently_updated.page(@page).without_count
    respond_to do |format|
      format.html { render partial: 'users/user_messages', status: :ok, locals: { messages: @messages } }
    end
  end

  def edit_username
    respond_to do |format|
      format.html { render partial: 'users/edit_username', status: :ok, locals: { user: @user } }
    end
  end

  def edit_password
    respond_to do |format|
      format.html { render partial: 'users/edit_password', status: :ok, locals: { user: @user } }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_user
    @user = User.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def user_params
    params.require(:user).permit(:username, :password, :password_confirmation)
  end

  def confirm_auth
    redirect_to(posts_path, alert: "You don't have permission to do that") unless current_user == @user
  end
end
