class DataPoint < ApplicationRecord
  TYPE_COLUMN_MAPPING = {
    'boolean' => 'integer_value',
    'number'  => 'float_value'
  }

  belongs_to :metric

  validates :metric, presence: true
  validates :on_date, presence: true

  scope :for_user, ->(user) { joins(:metric).where(metrics: { user: user }) }
  scope :for_date, ->(date) { where(on_date: date) }

  delegate :metric_type, to: :metric

  def as_json(options = {})
    {
      id: id,
      metricId: metric_id,
      onDate: on_date,
      value: value
    }
  end

  def value
    send(TYPE_COLUMN_MAPPING[metric_type])
  end

  def value=(val)
    send("#{TYPE_COLUMN_MAPPING[metric_type]}=", val)
  end
end
