require 'rails_helper'

RSpec.describe "DataPoints page", type: :system do
  let(:user) { create(:user) }

  before { sign_in user }

  context "with one boolean metric" do
    let!(:metric) { create(:metric, user: user) }

    it "shows tracking view for most recent N days" do
      create(:data_point, metric: metric, on_date: Date.current, value: 1)
      create(:data_point, metric: metric, on_date: Date.current - 2.day, value: 0)
    
      visit '/'

      expect(page).to have_button('prev-date')
      expect(page).to have_no_button('next-date-link')

      all(".date-heading").each.with_index do |dh, i|
        expect(dh).to have_text(Date.current.advance(days: -3 + i).strftime('%-m-%-d-%y'))
      end

      within "#metric-#{metric.id}" do
        expect(page).to have_content(metric.name)
        expect(page).to have_content(/1-day streak/i)

        within "#data-point-#{metric.id}-#{Date.current}" do
          expect(page).to have_content('Yes')
        end

        within "#data-point-#{metric.id}-#{Date.current - 1.day}" do
          expect(page).to have_content('Edit')
        end

        within "#data-point-#{metric.id}-#{Date.current - 2.days}" do
          expect(page).to have_content('No')
        end

        within "#data-point-#{metric.id}-#{Date.current - 3.days}" do
          expect(page).to have_content('Edit')
        end
      end
    end

    it "updates tracking view when navigating back a day" do
      create(:data_point, metric: metric, on_date: Date.current, value: 1)
      create(:data_point, metric: metric, on_date: Date.current - 4.days, value: 0)

      visit '/'
      click_button 'prev-date'

      expect(page).to have_button('prev-date')
      expect(page).to have_button('next-date-link')

      all(".date-heading").each.with_index do |dh, i|
        expect(dh).to have_text(Date.current.advance(days: -4 + i).strftime('%-m-%-d-%y'))
      end

      within "#metric-#{metric.id}" do
        expect(page).to have_content(metric.name)
        expect(page).to have_content(/1-day streak/i)

        within "#data-point-#{metric.id}-#{Date.current - 4.days}" do
          expect(page).to have_content('No')
        end
      end
    end

    it "persists and updates values correctly" do
      visit '/'

      within "#data-point-#{metric.id}-#{Date.current}" do
        find('.edit-value').click
        click_button 'Yes'
      end

      click_button 'prev-date'

      within "#data-point-#{metric.id}-#{Date.current - 4.days}" do
        find('.edit-value').click
        click_button 'No'
      end

      click_button 'next-date-link'

      within "#data-point-#{metric.id}-#{Date.current}" do
        expect(page).to have_content('Yes')
      end

      click_button 'prev-date'

      within "#data-point-#{metric.id}-#{Date.current - 4.days}" do
        expect(page).to have_content('No')
      end
    end
  end

  context "with one number metric" do
    let!(:metric) { create(:metric, user: user, metric_type: :number) }

    it "supports number fields" do
      visit '/'

      within "#data-point-#{metric.id}-#{Date.current}" do
        find('.edit-value').click
        fill_in with: '149.2'
      end

      click_button 'prev-date'
      
      find "#data-point-#{metric.id}-#{Date.current - 4.days}"

      click_button 'next-date-link'

      within "#metric-#{metric.id}" do
        expect(page).to have_content(/1-day streak/i)

        within "#data-point-#{metric.id}-#{Date.current}" do
          expect(page).to have_content('149.2')
        end
      end
    end
  end
end
