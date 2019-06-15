class ApplicationController < ActionController::Base
  def after_sign_in_path_for(resource)
    data_points_url
  end

  def self.pack(pack)
    before_action { @pack = pack }
  end

  def self.selected_nav(nav)
    before_action { @selected_nav = nav }
  end
end
