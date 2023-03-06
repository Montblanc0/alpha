json.extract! post, :id, :caption, :image_url, :user_id, :created_at, :updated_at
json.url post_url(post, format: :json)
