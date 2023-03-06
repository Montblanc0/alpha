class NasaController < ApplicationController
  #   protect_from_forgery with: :null_session

  # GET /nasa
  def index; end

  # POST fetch request
  def show
    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: turbo_stream.update('nasaPreview', partial: nasa_params[:media_type] == 'video' ? 'nasa/video' : 'nasa/image', locals: {
                                                   caption: nasa_params[:caption],
                                                   url: nasa_params[:url],
                                                   explanation: nasa_params[:explanation]
                                                 })
      end
      format.html do
        redirect_to nasa_path, alert: 'This feature needs JavaScript to work properly.'
      end
      format.json do
        render json: { date: nasa_params[:date],
                       title: nasa_params[:caption],
                       explanation: nasa_params[:explanation],
                       url: nasa_params[:url] }
      end
    end
  end

  private

  def nasa_params
    params.permit(:caption, :media_type, :explanation, :url, :authenticity_token, :commit)
  end
end
