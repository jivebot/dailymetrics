FactoryBot.define do
  factory :data_point do
    metric
    on_date { Date.current }
    integer_value { 1 }

    after(:create) do |data_point|
      data_point.metric.update_streaks! if data_point.metric.persisted?
    end
  end
end
