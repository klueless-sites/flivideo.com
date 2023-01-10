---
layout: ~/layouts/BaseLayout.astro
title: Exclude RSpec test in Production
---

Research

- [Research 1](https://relishapp.com/rspec/rspec-core/docs/command-line/tag-option)
- [Research 2](https://stackoverflow.com/a/24038190)
- [Research 3](https://stackoverflow.com/a/7853245)
- [Research 4](https://stackoverflow.com/a/54616209)
- [Research 5]()
- [Research 6]()

Need to implement here: *spec/tailwind_dsl/etl/raw_components/director_spec.rb*

```bash
There are many options:

rspec spec                           # All specs
rspec spec/models                    # All specs in the models directory
rspec spec/models/a_model_spec.rb    # All specs in the some_model model spec
rspec spec/models/a_model_spec.rb:nn # Run the spec that includes line 'nn'
rspec -e"text from a test"           # Runs specs that match the text
rspec spec --tag focus               # Runs specs that have :focus => true
rspec spec --tag focus:special       # Run specs that have :focus => special
rspec spec --tag focus ~skip         # Run tests except those with :focus => tru
```

```ruby
RSpec.configure do |config|
  config.filter_run :focus => true
  config.run_all_when_everything_filtered = true
end
```

```ruby
it 'can do so and so', focus: true do
  # This is the only test that will run
end

fit 'can do so and so' do
  # This is the only test that will run
end
```

```bash
$ rspec ./spec/models/company_spec.rb:81:82:83:103

Run options: include {:locations=>{"./spec/models/company_spec.rb"=>[81, 82, 83, 103]}}
```