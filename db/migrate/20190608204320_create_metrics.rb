class CreateMetrics < ActiveRecord::Migration[5.2]
  def change
    create_table :metrics do |t|
      t.references :user, foreign_key: true, null: false
      t.string :name, limit: 255, null: false
      t.integer :metric_type, default: 10, null: false
      t.timestamps
    end
  end
end
