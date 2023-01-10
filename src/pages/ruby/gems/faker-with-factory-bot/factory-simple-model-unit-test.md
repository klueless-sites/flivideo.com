---
layout: ~/layouts/BaseLayout.astro
title: Factory -> Simple -> Unit Test
---

## Overview

Configuring factory data for unit environments when the target Model is simple

<!-- May want to implement this as a tip so that the link is just for more information -->
See: [Should I use Faker?](http://localhost:3002/ruby/gems/faker-with-factory-bot/static-vs-random-data-in-tests#when-to-use-faker)

### Example Factory for unit tests

By default, only the minimum amount of data is used, there are no required attributes on this model and so, `name` is `nil` and `settings` are `{}` empty.

There a limited number of traits that are used for specific testing scenarios.

```ruby
FactoryBot.define do
  factory :region do
    name { }
    settings { {} }

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

### Create some test data

```ruby
def regions
  # Default data
  @empty_region = create(:region)
  
  # Custom region
  @western_sydney_region = create(:region, name: 'Western Sydney', settings: { 'suburbs' => ['Blacktown', 'Parramatta', 'Penrith', 'Campbelltown', 'Liverpool'] } )

  # Via traits
  @north_shore_region = create(:region, :north_shore)
  @inner_west_region = create(:region, :inner_west)
end
```

### Example output

![](/images/ruby/gems/faker-with-factory-bot/factory-simple-model-unit-test-example.png)
