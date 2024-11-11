class StaticController < StaticBaseController
  def index
    render file: Rails.root.join('public', 'index.html'), layout: false
  end
end
