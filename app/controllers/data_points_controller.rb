class DataPointsController < ApplicationController
  before_action :authenticate_user!
  pack 'data_points'
  selected_nav 'tracking'

  def index
    respond_to do |format|
      format.html
      format.json { render json: data_points(selected_date) }
    end
  end

  def create
    metric, data_point = set_data_point(params[:metric_id], selected_date, params[:value])
    data_point ||= metric.data_points.build

    render json: data_point.as_json(metric: metric)
  end

  private

  def selected_date
    params[:date]&.to_date || Date.current
  end

  def data_points(date)
    metrics = current_user.metrics.order(:id)

    # Find existing data points user has already entered for this date so
    # that they don't need to be loaded one-by-one later.
    existing_data_points = DataPoint.for_user(current_user).for_date(date)
      .includes(:metric)
      .to_h { |d| [d.metric_id, d] }

    # Build list of either existing or new data points for each metric.
    metrics.map do |metric|
      existing_data_points[metric.id] || metric.data_points.build
    end
  end

  def set_data_point(metric_id, date, value)
    metric = current_user.metrics.find(metric_id)

    if value.present?
      data_point = metric.data_points.find_or_initialize_by(on_date: date)
      data_point.value = value
      data_point.save!
    else
      metric.data_points.where(on_date: date).delete_all
    end

    metric.update_streaks!

    [metric, data_point]
  end
end
