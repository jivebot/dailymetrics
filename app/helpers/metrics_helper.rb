module MetricsHelper
  def metric_type_options
    Metric::METRIC_TYPE_NAMES.to_a.map(&:reverse)
  end
end
