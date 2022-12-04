Rails.application.routes.draw do
  concern :paginatable do
    get '(page/:page)', action: :index, on: :collection, as: ''
  end

  concern :user_paginatable_posts do
    get '(page/:page)', action: :user_posts, on: :collection, as: ''
  end
  concern :user_paginatable_messages do
    get '(page/:page)', action: :user_messages, on: :collection, as: ''
  end

  resources :messages, concerns: :paginatable
  resources :posts, concerns: :paginatable
  resources :users, except: :index do
    resources :posts, concerns: :user_paginatable_posts
    resources :messages, concerns: :user_paginatable_messages
  end

  resources :sessions, only: %i[new create destroy]

  get 'login', to: 'sessions#new'
  get 'logout', to: 'sessions#destroy'
  get 'signup', to: 'users#new'

  get 'messages/reload/:id', to: 'messages#reload'

  get '(users)/posts/:id/prompt', to: 'posts#prompt'
  get '(users)/messages/:id/prompt', to: 'messages#prompt'
  get 'users/:id/prompt', to: 'users#prompt'

  get 'users/:id/posts', to: 'posts#user_posts'
  get 'users/:id/messages', to: 'messages#user_messages'

  get 'users/:id/edit_password', to: 'users#edit_password'
  get 'users/:id/edit_username', to: 'users#edit_username'

  get 'nasa', to: 'nasa#index'
  post 'nasa', to: 'nasa#show'

  # Defines the root path route ("/")
  root 'landing#index'
  %w[home landing welcome index].each do |route|
    get route, to: 'landing#index'
  end
end
