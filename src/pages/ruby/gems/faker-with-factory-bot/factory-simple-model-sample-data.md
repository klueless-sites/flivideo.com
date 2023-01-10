---
layout: ~/layouts/BaseLayout.astro
title: Factory -> Simple -> Sample or Seed Data
---

## Overview

Configuring factory data for sample data environments. These are environments when realistic data is useful such as development and UAT.

<!-- May want to implement this as a tip so that the link is just for more information -->
See: [Is Faker a good fit for UAT?](http://localhost:3002/ruby/gems/faker-with-factory-bot/static-vs-random-data-in-tests#when-to-use-faker)

### Example Factory for sample data generation

Sample data needs to be realistic and so Faker becomes a good choice.

Sometimes you need to specific data examples and `traits` or `xxx` can be useful.

```ruby
FactoryBot.define do
  factory :sample_region, class: "Region" do
    name { Faker::Australia.location }
    settings { Faker::Json.shallow_json(width: 3, options: { key: 'Name.first_name', value: 'Name.last_name' }) }

    # Use traits when you have specific data requirement in sample data
    trait :western_sydney do
      name { 'Western Sydney' }
      settings { { 'suburbs' => ['Blacktown', 'Parramatta', 'Penrith', 'Campbelltown', 'Liverpool'] } }
    end

    trait :sydney do
      name { 'Sydney CBD' }
      settings { { 'suburbs' => ['Sydney', 'Sydney CBD', 'Surry Hills', 'Darling Harbour', 'Barangaroo'] } }
    end

    trait :eastern_suburbs do
      name { 'Eastern Suburbs' }
      settings { { 'suburbs' => ['Bondi', 'Bondi Beach', 'Bondi Junction', 'Bronte', 'Coogee', 'Darlinghurst'] }}
    end

    trait :inner_west do
      name { 'Inner West' }
      settings { { 'suburbs' => ['Ashfield', 'Burwood', 'Campsie', 'Croydon', 'Newtown'] } }
    end

    trait :north_shore do
      name { 'North Shore' }
      settings { { 'suburbs' => ['Pymble', 'Castle Cove', 'Castlecrag', 'Chatswood', 'Crows Nest', 'Cremorne'] } }
    end
  end
end
```

### Create sample data

```ruby
def regions
  @region_western_sydney = create(:sample_region, :western_sydney)
  @region_sydney = create(:sample_region, :sydney)
  @region_eastern_suburbs = create(:sample_region, :eastern_suburbs)
  @region_inner_west = create(:sample_region, :inner_west)
  @region_north_shore = create(:sample_region, :north_shore)

  # Using create_list can be great for pagination scenarios
  @regions_random = create_list(:sample_region, 20)
end
```

### Example output

![](/images/ruby/gems/faker-with-factory-bot/factory-simple-model-sample-test-example.png)