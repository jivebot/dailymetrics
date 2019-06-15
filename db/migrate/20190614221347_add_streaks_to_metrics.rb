class AddStreaksToMetrics < ActiveRecord::Migration[5.2]
  def change
    add_column :metrics, :presence_streak_start, :date
    add_column :metrics, :presence_streak_days, :integer
    add_column :metrics, :positive_streak_start, :date
    add_column :metrics, :positive_streak_days, :integer
  end
end
