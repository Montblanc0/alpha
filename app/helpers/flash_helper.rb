module FlashHelper
  def render_turbo_flash
    turbo_stream.update('flash', partial: 'layouts/flash')
  end

  def render_turbo_flash_with(obj)
    turbo_stream.update('flash', partial: 'layouts/flash', locals: { obj: })
  end
end
