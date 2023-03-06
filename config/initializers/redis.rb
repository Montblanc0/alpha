# frozen_string_literal: true

$redis = ENV['REDIS_URL'] ? Redis.new(url: ENV['REDIS_URL']) : Redis.new(url: 'redis://localhost:6379/0')