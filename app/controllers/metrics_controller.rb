class MetricsController < ApplicationController
  before_action :authenticate_user!
  selected_nav 'metrics'
  before_action :set_metric, only: [:edit, :update, :destroy]

  def index
    @metrics = current_user.metrics.order(:id)
  end

  def new
    @metric = Metric.new
  end

  def edit
  end

  def create
    @metric = current_user.metrics.build(metric_params)

    if @metric.save
      redirect_to metrics_url, notice: 'Metric was successfully created.'
    else
      render :new
    end
  end

  def update
    if @metric.update(metric_params)
      redirect_to metrics_url, notice: 'Metric was successfully updated.'
    else
      render :edit
    end
  end

  def destroy
    @metric.destroy
    redirect_to metrics_url, notice: 'Metric was successfully destroyed.'
  end

  private

  def set_metric
    @metric = current_user.metrics.find(params[:id])
  end

  def metric_params
    params.require(:metric).permit(:name, :metric_type)
  end
end
