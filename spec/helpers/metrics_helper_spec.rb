require 'rails_helper'

RSpec.describe MetricsHelper, type: :helper do
  describe "#metric_type_options" do
    before do
      stub_const("Metric::METRIC_TYPE_NAMES", { 'boolean' => 'Yes / No'})
    end

    it "returns labels and values" do
      expect(helper.metric_type_options.first).to eq(['Yes / No', 'boolean'])
    end
  end
end
