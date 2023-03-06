class PostsController < ApplicationController
  include RecordHelper
  include FlashHelper
  include SessionsHelper
  include ModalHelper

  before_action :confirm_auth, except: %i[index show user_posts]
  before_action :confirm_owner, only: %i[edit update destroy]
  rescue_from ActiveRecord::RecordNotFound, with: :catch_not_found

  # GET /posts or /posts.json
  def index
    # @posts = Post.by_recently_created.limit(20)

    @page = params[:page] || 1
    @posts = Post.by_recently_created.page(@page).without_count
    respond_to do |format|
      format.turbo_stream if @page.to_i > 1
      format.html
    end
  end

  # GET /posts/1 or /posts/1.json
  def show
    set_post
  end

  def user_posts
    set_user
    @page = params[:page] || 1
    @posts = @user.posts.by_recently_created.page(@page).without_count
    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: [
          turbo_stream.remove('spinner'),
          turbo_stream.append('user-posts', partial: 'user_posts', locals: { posts: @posts })
        ]
      end
      format.html { render partial: 'users/user_posts', status: :ok, locals: { posts: @posts } }
    end
  end

  # GET /posts/new
  def new
    @post = current_user.posts.new upload_type: post_params[:upload_type] ||= :storage
  end

  # GET /posts/1/edit
  def edit; end

  # POST /posts or /posts.json
  def create
    @post = current_user.posts.new(post_params)

    respond_to do |format|
      if @post.save

        format.html { redirect_to posts_path, notice: 'Post was successfully created.' }
        format.json { render :show, status: :created, location: @post }
      else
        err_msg = 'An error occurred. Please make sure to upload image files smaller than 2 MBs only'
        format.turbo_stream do
          flash.now[:alert] = err_msg
          render turbo_stream: render_turbo_flash
        end
        format.html do
          redirect_to posts_path, alert: err_msg
        end
        format.json { render json: @post.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /posts/1 or /posts/1.json
  def update
    respond_to do |format|
      if @post.update(post_params)
        format.turbo_stream do
          flash.now[:notice] = 'Post was successfully updated.'
          render turbo_stream: [
            turbo_stream.update("content_post_#{@post.id}", partial: 'posts/details', locals: { post: @post }),
            render_turbo_flash
          ]
        end
        format.html do
          redirect_to post_url(@post), notice: 'Post was successfully updated.'
        end
        format.json { render :show, status: :ok, location: @post }
      else
        format.turbo_stream do
          flash.now[:alert] = 'Post was not updated:'
          render turbo_stream: [render_turbo_flash_with(@post),
                                turbo_stream.replace('edit_form', partial: 'posts/edit_form', locals: { post: @post })]
        end
        format.html { render :edit, status: :unprocessable_entity, alert: 'Post was not updated.' }
        format.json { render json: @post.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /posts/1 or /posts/1.json
  def destroy
    @post.destroy

    respond_to do |format|
      format.html do
        redirect_to posts_url, notice: 'Post was successfully destroyed.'
      end
      format.json { head :no_content }
    end
  end

  def prompt
    set_post
    show_modal(@post)
  end

  private

  def confirm_auth
    confirm_login(posts_path)
  end

  def confirm_owner
    set_post
    redirect_to posts_url, alert: 'User not authorized' if current_user != @post.user
  end

  # Use callbacks to share common setup or constraints between actions.

  def set_post
    @post = Post.find(params[:id])
  end

  def set_user
    @user = User.find(params[:user_id])
  end

  # Only allow a list of trusted parameters through.
  def post_params
    params.fetch(:post, {}).permit(:upload_type, :caption, :image, :image_cache, :remote_image_url)
    # params.require(:post).permit(:upload_type, :caption, :image, :image_cache, :remote_image_url)
  end
end
