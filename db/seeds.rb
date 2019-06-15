user = User.create!(
  email: "jason@jasonives.com",
  password: "password",
  password_confirmation: "password"
)

user.metrics.create!(name: "Flossed", metric_type: "boolean")
user.metrics.create!(name: "Went for a walk", metric_type: "boolean")
