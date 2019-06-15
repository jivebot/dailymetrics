require 'rails_helper'

RSpec.describe "DataPoints page", type: :system do
  let(:user) { create(:user) }
  let!(:metric_1) { create(:metric, user: user) }
  let!(:metric_2) { create(:metric, user: user) }

  before { sign_in user }

  it "shows tracking view for today" do
    create(:data_point, metric: metric_1, on_date: Date.current, value: 1)
  
    visit '/'
    date = Date.current
    expect(page).to have_text(date.strftime('%A, %B %-d'))

    expect(page).to have_link('prev-date-link')
    expect(page).to have_no_link('next-date-link')

    within "#metric-#{metric_1.id}" do
      expect(page).to have_content(metric_1.name)
      expect(find_field('Yes')).to be_checked
      expect(page).to have_content(/1-day streak/i)
    end

    within "#metric-#{metric_2.id}" do
      expect(page).to have_content(metric_2.name)
      expect(find_field('Yes')).not_to be_checked
      expect(find_field('No')).not_to be_checked
      expect(page).to have_no_content(/streak/i)
    end
  end

  it "shows tracking view when navigating to yesterday" do
    create(:data_point, metric: metric_2, on_date: Date.current - 1.day, value: 1)

    visit '/'
    click_link 'prev-date-link'

    date = Date.current - 1.day
    expect(page).to have_text(date.strftime('%A, %B %-d'))

    expect(page).to have_link('prev-date-link')
    expect(page).to have_link('next-date-link')

    within "#metric-#{metric_1.id}" do
      expect(page).to have_content(metric_1.name)
      expect(find_field('Yes')).not_to be_checked
      expect(find_field('No')).not_to be_checked
      expect(page).to have_no_content(/streak/i)
    end

    within "#metric-#{metric_2.id}" do
      expect(page).to have_content(metric_2.name)
      expect(find_field('Yes')).to be_checked
      expect(page).to have_content(/1-day streak/i)
    end
  end

  it "persists and updates values correctly" do
    visit '/'

    within "#metric-#{metric_1.id}" do
      choose 'Yes'
    end

    click_link 'prev-date-link'

    within "#metric-#{metric_2.id}" do
      choose 'No'
    end

    click_link 'next-date-link'

    within "#metric-#{metric_1.id}" do
      expect(find_field('Yes')).to be_checked
    end

    click_link 'prev-date-link'

    within "#metric-#{metric_2.id}" do
      expect(find_field('No')).to be_checked
    end
  end
end
