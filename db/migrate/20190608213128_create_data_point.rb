class CreateDataPoint < ActiveRecord::Migration[5.2]
  def change
    create_table :data_points do |t|
      t.references :metric, foreign_key: true, null: false
      t.date :on_date, null: false
      t.integer :integer_value
      t.timestamps

      t.index [:on_date, :metric_id], unique: true
    end
  end
end
