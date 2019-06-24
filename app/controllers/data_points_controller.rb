class DataPointsController < ApplicationController
  before_action :authenticate_user!
  pack 'data_points'
  selected_nav 'tracking'

  def index
    respond_to do |format|
      format.html
      format.json do
        dates = params[:dates].map(&:to_date)
        payload = { data_points: data_points(dates) }
        payload[:metrics] = metrics if params[:load_metrics].present?
        render json: payload
      end
    end
  end

  def create
    metric = current_user.metrics.find(params[:metric_id])
    data_point = metric.set_data_point(params[:date]&.to_date, params[:value])

    render json: metric
  end

  private

  def metrics
    current_user.metrics.order(:id)
  end

  def data_points(dates)
    DataPoint.for_user(current_user).for_date(dates).includes(:metric)
  end
end
