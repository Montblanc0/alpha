module ModalHelper
  def show_modal(obj)
    respond_to do |format|
      format.turbo_stream do
        render turbo_stream:
             turbo_stream.update('modal', partial: 'modal', locals: { obj: obj })
      end
      format.html { render obj, status: :ok }
    end
  end
end
