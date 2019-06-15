require 'rails_helper'

RSpec.describe Metric, type: :model do
  
  describe "#update_streaks!" do
    let!(:user) { create(:user) }
    let(:metric_type) { :boolean }
    let!(:metric_1) { create(:metric, metric_type: metric_type) }

    it "sets presence values if data points exist" do
      create(:data_point, metric: metric_1, on_date: Date.new(2019, 6, 14), value: 1)
      metric_1.update_streaks!
      expect(metric_1.presence_streak_start).to eq(Date.new(2019, 6, 14))
      expect(metric_1.presence_streak_days).to eq(1)
      expect(metric_1.changed?).to be_falsey
    end

    it "clears presence values if no data points" do
      dp = create(:data_point, metric: metric_1, on_date: Date.new(2019, 6, 14), value: 1)
      metric_1.update_streaks!

      dp.destroy
      metric_1.update_streaks!
      expect(metric_1.presence_streak_start).to be_nil
      expect(metric_1.presence_streak_days).to be_nil
      expect(metric_1.changed?).to be_falsey
    end

    context "for boolean metric type" do
      let(:metric_type) { :boolean }

      it "sets presence values if data points exist" do
        create(:data_point, metric: metric_1, on_date: Date.new(2019, 6, 14), value: 1)
        metric_1.update_streaks!
        expect(metric_1.positive_streak_start).to eq(Date.new(2019, 6, 14))
        expect(metric_1.positive_streak_days).to eq(1)
        expect(metric_1.changed?).to be_falsey
      end

      it "clears presence values if no data points" do
        dp = create(:data_point, metric: metric_1, on_date: Date.new(2019, 6, 14), value: 1)
        metric_1.update_streaks!
  
        dp.destroy
        metric_1.update_streaks!
        expect(metric_1.positive_streak_start).to be_nil
        expect(metric_1.positive_streak_days).to be_nil
        expect(metric_1.changed?).to be_falsey
      end
    end
  end
  
  describe "#latest_streak" do
    let!(:user) { create(:user) }
    let!(:metric_1) { create(:metric) }
    let!(:metric_2) { create(:metric) }

    context "for presence streak" do
      it "returns the latest streak" do
        create(:data_point, metric: metric_1, on_date: Date.new(2019, 6, 14), value: 1)
        create(:data_point, metric: metric_1, on_date: Date.new(2019, 6, 13), value: 1)

        expect(metric_1.latest_streak(:presence)[:streak_start]).to eq(Date.new(2019, 6, 13))
        expect(metric_1.latest_streak(:presence)[:streak_days]).to eq(2)
      end

      it "ignores longer streaks in the past" do
        create(:data_point, metric: metric_1, on_date: Date.new(2019, 6, 12), value: 1)

        create(:data_point, metric: metric_1, on_date: Date.new(2019, 6, 10), value: 1)
        create(:data_point, metric: metric_1, on_date: Date.new(2019, 6, 9), value: 1)

        expect(metric_1.latest_streak(:presence)[:streak_start]).to eq(Date.new(2019, 6, 12))
        expect(metric_1.latest_streak(:presence)[:streak_days]).to eq(1)
      end

      it "ignores streaks for other metrics" do
        create(:data_point, metric: metric_2, on_date: Date.new(2019, 6, 12), value: 1)

        expect(metric_1.latest_streak(:presence)).to be_nil
      end

      it "returns nil if no data points" do
        expect(metric_1.latest_streak(:presence)).to be_nil
      end
    end

    context "for positive streak" do
      it "returns latest streak if last value was positive" do
        create(:data_point, metric: metric_1, on_date: Date.new(2019, 6, 12), value: 1)
        # Change in value
        create(:data_point, metric: metric_1, on_date: Date.new(2019, 6, 11), value: 0)
        
        expect(metric_1.latest_streak(:positive)[:streak_start]).to eq(Date.new(2019, 6, 12))
        expect(metric_1.latest_streak(:positive)[:streak_days]).to eq(1)
      end

      it "returns nil if only value was negative" do
        create(:data_point, metric: metric_1, on_date: Date.new(2019, 6, 15), value: 0)

        expect(metric_1.latest_streak(:positive)).to be_nil
      end

      it "returns nil if last value was negative" do
        create(:data_point, metric: metric_1, on_date: Date.new(2019, 6, 15), value: 0)
        # Change in value
        create(:data_point, metric: metric_1, on_date: Date.new(2019, 6, 14), value: 1)

        expect(metric_1.latest_streak(:positive)).to be_nil
      end

      it "ignores longer streaks in the past" do
        create(:data_point, metric: metric_1, on_date: Date.new(2019, 6, 12), value: 1)
        # Change in value
        create(:data_point, metric: metric_1, on_date: Date.new(2019, 6, 11), value: 0)
        # Change in value
        create(:data_point, metric: metric_1, on_date: Date.new(2019, 6, 10), value: 1)
        create(:data_point, metric: metric_1, on_date: Date.new(2019, 6, 9), value: 1)
        
        expect(metric_1.latest_streak(:positive)[:streak_start]).to eq(Date.new(2019, 6, 12))
        expect(metric_1.latest_streak(:positive)[:streak_days]).to eq(1)
      end

      it "ignores streaks for other metrics" do
        create(:data_point, metric: metric_2, on_date: Date.new(2019, 6, 12), value: 1)

        expect(metric_1.latest_streak(:positive)).to be_nil
      end

      it "returns nil if no data points" do
        expect(metric_1.latest_streak(:positive)).to be_nil
      end
    end
  end
end
