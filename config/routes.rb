Rails.application.routes.draw do
  devise_for :users

  root to: 'data_points#index'

  resources :data_points, only: [:index, :create]
end
