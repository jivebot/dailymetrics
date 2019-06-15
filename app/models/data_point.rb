class DataPoint < ApplicationRecord
  belongs_to :metric

  validates :metric, presence: true
  validates :on_date, presence: true

  scope :for_user, ->(user) { joins(:metric).where(metrics: { user: user }) }
  scope :for_date, ->(date) { where(on_date: date) }

  def as_json(options = {})
    hash = super(
      except: [:integer_value, :created_at, :updated_at],
      methods: [:value]
    )
    metric = options[:metric] || self.metric
    hash[:metric] = metric.as_json(except: [:user_id, :created_at, :updated_at])
    hash
  end

  def value
    integer_value
  end

  def value=(val)
    self.integer_value = val
  end
end
