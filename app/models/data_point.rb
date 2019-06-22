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
    hash = super(
      only: [:metric_id, :on_date],
      methods: [:value]
    )
    metric = options[:metric] || self.metric
    hash[:metric] = metric.as_json(except: [:user_id, :created_at, :updated_at])
    hash
  end

  def value
    send(TYPE_COLUMN_MAPPING[metric_type])
  end

  def value=(val)
    send("#{TYPE_COLUMN_MAPPING[metric_type]}=", val)
  end
end
