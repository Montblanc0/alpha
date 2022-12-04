class ApplicationController < ActionController::Base
  include ApplicationHelper
  before_action :set_current_user, if: :user_logged_in?

  private

  def user_logged_in?
    session[:user_id] ? true : false
  end

  def set_current_user
    Current.user = current_user
  end
end
