FactoryBot.define do
  sequence :metric_names do |n|
    "Metric #{n}"
  end

  factory :metric do
    user
    name { generate(:metric_names) }
    metric_type { :boolean }
  end
end
