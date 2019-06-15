class Metric < ApplicationRecord
  belongs_to :user
  has_many :data_points, dependent: :destroy

  enum metric_type: {
    boolean: 10
  }, _prefix: 'type'

  validates :user, presence: true

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
end
