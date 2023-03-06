module RecordHelper
  def catch_not_found
    redirect_to posts_url, alert: 'Record not found.'
  end
end
