class AddFloatValueToDataPoint < ActiveRecord::Migration[5.2]
  def change
    add_column :data_points, :float_value, :float
  end
end
