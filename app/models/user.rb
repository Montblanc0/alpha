class User < ApplicationRecord
  has_secure_password
  validates :username, uniqueness: { case_sensitive: false }, format: { with: /^(?!.* ).{1,}$/, multiline: true },
                       length: { minimum: 4, maximum: 25 }
  validates :password, format: { with: /^(?!.* ).{1,}$/, multiline: true }, length: { minimum: 8 }, allow_nil: true
  has_many :posts, dependent: :destroy
  has_many :messages, dependent: :destroy

  def to_s
    username
  end
end
