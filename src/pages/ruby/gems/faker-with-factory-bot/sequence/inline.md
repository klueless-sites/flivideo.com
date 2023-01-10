---
layout: ~/layouts/BaseLayout.astro
title: Global Sequence
---

```ruby
# factories/sequences.rb
FactoryBot.define do
  factory :user do
    name { "John" }
    sequence(:email) { |n| "name#{n}@domain.com"}
    github_username { "#{name}-github"}
  end
end
```
