---
layout: ~/layouts/BaseLayout.astro
title: Defining traits on a factory
---

Traits allow you to group attributes together and then apply them to any factory.

## Traits for data variation

Traits can be useful when you want to provide specific data variations to a factory.

### User with role flag

```ruby
FactoryBot.define do
  factory :user do
    first_name { "John" }
    last_name  { "Doe" }
    admin { false }

    trait :boss do
      admin { true }
    end
  end
end
```

```ruby
# John will be created with the :admin attribute set to true
@john_the_boss = create(:user, :boss)
```

### Blog article in draft mode

```ruby
FactoryBot.define do
  factory :article do
    title { Faker::Quote.famous_last_words }
    body { Faker::Lorem.paragraphs(number: rand(4...10)).join("\n") }
    published { rand(1..20).days.ago }

    trait :draft do
      published { nil }
    end
  end
end
```

```ruby
# This post will have a nil published date
@unpublished_post = create(:article, :draft)
```

## Enum Traits (non ActiveRecord)

If you are using ActiveRecord then enums automatically work by default, but if you are using a non ActiveRecord model then you can create enums using:

### #traits_for_enums

```ruby
FactoryBot.define do
  factory :article do
    traits_for_enum :category, %w[ruby javascript golang python]
  end
end
```

is equivalent to:

```ruby
FactoryBot.define do
  factory :article do
    trait :ruby do
      code { 'ruby' }
    end
    trait :javascript do
      code { 'javascript' }
    end
    trait :golang do
      code { 'golang' }
    end
    trait :python do
      code { 'python' }
    end
  end
end
```

And both can be used like this:

```ruby
@article_on_ruby = create(:article, :ruby)
@article_on_python = create(:article, :python)
```


## Get a list of available traits

You can interrogate a factory to get a list of the traits programmatically

```ruby
FactoryBot.define do
  factory :role do
    code { 'user' }

    trait :contributor do
      code { 'contributor' }
    end
    trait :moderator do
      code { 'moderator' }
    end
    trait :admin do
      code { 'admin' }
    end
  end
end
```

### #defined_traits

```ruby
FactoryBot.factories[:role].defined_traits.map(&:name)

# => ["contributor", "moderator", "admin"]
```

## Global traits

If you have traits that need to be cross-cutting between different factories, you use global traits

[Do further research here](https://stackoverflow.com/a/23650027/473923)