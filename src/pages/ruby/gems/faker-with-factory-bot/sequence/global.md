---
layout: ~/layouts/BaseLayout.astro
title: Global Sequence
---

Sequences are use to generate a sequence of values.

Sequence values are created using the `generate` method or inline via the sequence name.

## Why Global Sequences?

Global sequences are useful when you have an attribute that needs to be unique is common across multiple classes.

Examples might include email address, user name, external url

### Example: Global Sequence

```ruby
# factories/sequences.rb
FactoryBot.define do
  sequence product_code: do |n|
    "SKU-%03d" % n # SKU-001 ... SKU-019
  end

  sequence email: do |n|
    "user+tag#{n}@domain.com"
  end

  sequence email: do |n|
    "user#{n}@domain.com"
  end
end
```

### Using global sequences

```ruby
FactoryBot.define do
  # inline
  factory :user do
    email
    first_name { "John" }
  end

  # generate method
  factory :product do
    sku { generate(:product_code) }
  end
end
```

### FactoryBot sequences vs Faker

> Think about how you would replicate this pattern using Faker instead of sequence at a global level

Sequences are predictable and good for known tests cases

Faker is unpredictable, it is good for readable sample data but may not be the best case for unit tests.

