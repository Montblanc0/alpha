class MessagesController < ApplicationController
  include RecordHelper
  include FlashHelper
  include SessionsHelper
  include ModalHelper
  before_action :set_message, only: %i[show edit update destroy reload prompt]
  rescue_from ActiveRecord::RecordNotFound, with: :catch_not_found
  before_action :confirm_auth, except: %i[index show reload user_messages]
  before_action :confirm_owner, only: %i[edit update destroy]

  # GET /messages or /messages.json
  def index
    # @messages = Message.by_recently_updated.limit(20)
    @page = params[:page] || 1
    @messages = Message.by_recently_updated.page(@page).without_count
    respond_to do |format|
      format.turbo_stream
      format.html
    end
  end

  # GET /messages/1 or /messages/1.json
  def show
    set_message
  end

  def user_messages
    set_user
    @page = params[:page] || 1
    @messages = @user.messages.by_recently_updated.page(@page).without_count
    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: [
          turbo_stream.remove('spinner'),
          turbo_stream.append('user-messages', partial: 'user_messages', locals: { messages: @messages })
        ]
      end
      format.html { render partial: 'users/user_messages', status: :ok, locals: { messages: @messages } }
    end
  end

  # GET /messages/new
  def new
    @message = Message.new
  end

  # GET /messages/1/edit
  def edit; end

  # replaces controls on broadcasted messages
  # (re-enables current_user)
  def reload
    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: turbo_stream.replace("controls_message_#{params[:id]}", partial: 'messages/controls',
                                                                                     locals: { message: @message })
      end
      format.html { redirect_to messages_url }
    end
  end

  # POST /messages or /messages.json
  def create
    @message = current_user.messages.new(message_params)

    respond_to do |format|
      if @message.save
        format.turbo_stream do
          flash.now[:notice] = 'Message was successfully created.'
          render turbo_stream: [
            turbo_stream.replace('message-form', partial: 'form', locals: { message: current_user.messages.new })
            ## Disabled -> broadcast replaces later to
            # turbo_stream.prepend('messages', partial: 'new_message', locals: { message: @message })

            # Uncomment below to notify on success
            # render_turbo_flash
          ]
        end
        format.html { redirect_to message_url(@message), notice: 'Message was successfully created.' }
        format.json { render :show, status: :created, location: @message }
      else
        format.turbo_stream do
          flash.now[:alert] = 'Message was not sent:'
          render turbo_stream: [
            turbo_stream.replace('message-form', partial: 'form', locals: { message: @message }),
            render_turbo_flash_with(@message)
          ]
        end
        format.html { render :new, status: :unprocessable_entity, alert: 'Message was not created.' }
        format.json { render json: @message.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /messages/1 or /messages/1.json
  def update
    respond_to do |format|
      if @message.update(message_params)
        format.turbo_stream do
          flash.now[:notice] = 'Message was successfully updated.'
          if request.referrer.include?('users')
            # update message in user profile
            render turbo_stream: [
              turbo_stream.remove(@message),
              turbo_stream.prepend('user-messages', partial: 'new_message', locals: { message: @message }),
              render_turbo_flash
            ]
          elsif request.referrer.include?(@message.id.to_s)
            # update message in show path
            render turbo_stream: [
              turbo_stream.update("content_message_#{@message.id}", partial: 'messages/content',
                                                                    locals: { message: @message }),
              render_turbo_flash
            ]
          else
            # update message in messages_path
            # turbo broadcast removes and replaces later to /messages
            render turbo_stream: render_turbo_flash
            ## Uncomment if broadcast is disabled
            #   render turbo_stream: [
            #     render_turbo_flash
            # turbo_stream.remove(@message)
            # turbo_stream.prepend('messages', partial: 'new_message', locals: { message: @message })
            #   ]
          end
        end
        format.html { redirect_to message_url(@message), notice: 'Message was successfully updated.' }
        format.json { render :show, status: :ok, location: @message }
      else
        format.turbo_stream do
          flash.now[:alert] = 'Message was not updated:'
          render turbo_stream: [
            turbo_stream.replace('message-form', partial: 'form', locals: { message: @message }),
            render_turbo_flash_with(@message)
          ]
        end
        format.html { render :edit, status: :unprocessable_entity, alert: 'Message was not updated.' }
        format.json { render json: @message.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /messages/1 or /messages/1.json
  def destroy
    @message.destroy

    respond_to do |format|
      format.html { redirect_to messages_url, notice: 'Message was successfully destroyed.' }
      format.json { head :no_content }
      format.turbo_stream do
        flash.now[:notice] = 'Message was successfully destroyed.'
        render turbo_stream: [
          turbo_stream.remove(@message)
          # Uncomment below to notify on success
          # render_turbo_flash
        ]
      end
    end
  end

  def prompt
    show_modal(@message)
  end

  private

  def confirm_auth
    confirm_login(messages_path)
  end

  def confirm_owner
    set_message
    redirect_to messages_url, alert: 'User not authorized' if current_user != @message.user
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_message
    @message = Message.find(params[:id])
  end

  def set_user
    @user = User.find(params[:user_id])
  end

  # Only allow a list of trusted parameters through.
  def message_params
    params.require(:message).permit(:content, :user_id)
  end
end
