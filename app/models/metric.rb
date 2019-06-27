class Metric < ApplicationRecord
  METRIC_TYPE_NAMES = {
    'boolean' => 'Yes / No',
    'number'  => 'Number'
  }

  belongs_to :user
  has_many :data_points, dependent: :delete_all

  enum metric_type: {
    boolean: 10,
    number:  20
  }, _prefix: 'type'

  validates :user, presence: true
  validates :name, presence: true
  validates :metric_type, presence: true

  def as_json(options = {})
    {
      id: id,
      name: name,
      metricType: metric_type,
      presenceStreakStart: presence_streak_start,
      presenceStreakDays: presence_streak_days,
      positiveStreakStart: positive_streak_start,
      positiveStreakDays: positive_streak_days
    }
  end

  def set_data_point(date, value)
    if value.present?
      data_point = data_points.find_or_initialize_by(on_date: date)
      data_point.value = value
      data_point.save!
    else
      data_point = nil
      data_points.where(on_date: date).delete_all
    end

    update_streaks!

    data_point
  end

  def update_streaks!
    update_streak(:presence)
    update_streak(:positive) if type_boolean?
    save!
  end

  def update_streak(streak_type)
    streak = latest_streak(streak_type)
    self.send("#{streak_type}_streak_start=", streak&.fetch(:streak_start))
    self.send("#{streak_type}_streak_days=", streak&.fetch(:streak_days))
  end

  def latest_streak(streak_type)
    positive_value = streak_type == :positive

    # Adapted from: https://stackoverflow.com/questions/21151401/postgres-defining-the-longest-streak-in-days-per-developer?rq=1
    row = ActiveRecord::Base.connection.exec_query(<<-SQL_END).rows.first
      SELECT min(on_date) AS streak_start, count(*) AS streak_days #{", integer_value" if positive_value}
      FROM (
        SELECT on_date, integer_value,
          (on_date - INTERVAL '1 DAY' * row_number() OVER (#{"PARTITION BY integer_value" if positive_value} ORDER BY on_date)) AS group_date
        FROM data_points
        WHERE metric_id = #{id}
      ) t1
      GROUP BY group_date #{", integer_value" if positive_value}
      ORDER BY streak_start DESC
      LIMIT 1;
    SQL_END

    if streak_type == :positive && row&.fetch(2) != 1
      nil
    else
      { streak_start: row[0].to_date, streak_days: row[1] } if row
    end
  end

  def metric_type_name
    METRIC_TYPE_NAMES[metric_type]
  end
end
