class Post < ApplicationRecord
  include OrderableByTimestamp

  enum :upload_type, %i[storage url], default: :storage

  belongs_to :user

  mount_uploader :image, ImageUploader

  validates :upload_type, inclusion: { in: %w[storage url], message: 'could not be determined.' }
  validates :caption, length: { maximum: 255 }

  with_options presence: true do
    validates :image, if: :storage?
    validates :remote_image_url, unless: :storage?
  end

  validates :image, file_size: { less_than_or_equal_to: 2.megabytes }, file_content_type: { allow: %r{^image/.*} }

  after_create_commit proc {
                        wait_for_processing_then do
                          broadcast_prepend_later_to 'posts', partial: 'posts/card', locals: { post: self }
                        end
                      }

  after_update_commit proc {
                        wait_for_processing_then do
                          broadcast_replace_later_to 'posts', partial: 'posts/card', locals: { post: self }
                        end
                      }
  after_destroy_commit -> { broadcast_remove_to 'posts' }

  def wait_for_processing_then(&action)
    max_runtime = 10.seconds.from_now
    loop do
      if Time.now > max_runtime
        puts 'Image is taking too long to be processed. Aborting.'
        return
      elsif image.version_exists?(:card)
        yield(action)
        return
      end
    end
  end
end
