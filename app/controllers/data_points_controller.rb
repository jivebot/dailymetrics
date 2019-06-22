class DataPointsController < ApplicationController
  before_action :authenticate_user!
  pack 'data_points'
  selected_nav 'tracking'

  def index
    respond_to do |format|
      format.html
      format.json do
        payload = { data_points: data_points(selected_date) }
        payload[:metrics] = metrics if params[:load_metrics].present?
        render json: payload
      end
    end
  end

  def create
    metric = current_user.metrics.find(params[:metric_id])
    data_point = metric.set_data_point(selected_date, params[:value])

    render json: metric
  end

  private

  def selected_date
    params[:date]&.to_date || Date.current
  end

  def metrics
    current_user.metrics.order(:id)
  end

  def data_points(date)
    DataPoint.for_user(current_user).for_date(date)
  end
end
