class Message < ApplicationRecord
  include OrderableByTimestamp

  belongs_to :user
  validates :content, presence: true, length: { maximum: 255 }
  #   broadcasts_to ->(_message) { 'messages' }, inserts_by: :prepend

  after_create_commit -> { broadcast_prepend_later_to 'messages', partial: 'messages/new_message' }

  after_update_commit proc {
                        broadcast_remove_to 'messages'
                        broadcast_prepend_later_to 'messages', partial: 'messages/new_message'
                      }
  after_destroy_commit -> { broadcast_remove_to 'messages' }
end
