module SessionsHelper
  def confirm_login(redirect_path)
    unless current_user
      err_message = 'You must login to do that.'

      respond_to do |format|
        format.turbo_stream do
          flash.now[:alert] = err_message
          render turbo_stream: render_turbo_flash
        end
        format.html { redirect_to(redirect_path, alert: err_message) }
      end
    end
  end
end
