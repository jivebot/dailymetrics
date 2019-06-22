require 'rails_helper'

RSpec.describe DataPoint, type: :model do
  
  describe "#value" do
    let(:metric_type) { :boolean }
    let(:metric) { create(:metric, metric_type: metric_type) }

    context "boolean type" do
      let(:metric_type) { :boolean }

      it "returns integer_value" do
        expect(metric.data_points.build(integer_value: 1).value).to eq(1)
      end
    end

    context "number type" do
      let(:metric_type) { :number }

      it "returns float_value" do
        expect(metric.data_points.build(float_value: 6.1).value).to eq(6.1)
      end
    end
  end
  
  describe "#value=" do
    let(:metric_type) { :boolean }
    let(:metric) { create(:metric, metric_type: metric_type) }
    let(:data_point) { metric.data_points.build }

    context "boolean type" do
      let(:metric_type) { :boolean }

      it "sets integer_value" do
        data_point.value = 1
        expect(data_point.integer_value).to eq(1)
      end
    end

    context "number type" do
      let(:metric_type) { :number }

      it "sets integer_value" do
        data_point.value = 4.5
        expect(data_point.float_value).to eq(4.5)
      end
    end
  end

end
