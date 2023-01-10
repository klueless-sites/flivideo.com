---
layout: ~/layouts/BaseLayout.astro
title: Mixing traits with nested factories
---

If you want to mix traits and factories together, the you need to understand that they focus on Composition vs Inheritance respectively.

You can find basic example in [Traits vs nested factories](ruby/gems/faker-with-factory-bot/basic-traits-vs-nested-factory)

## Scenario: Shop selling Personal Computers

You had an online store selling different types of computers and each computer was made up of different components.

Your product list might look like

- MacBook Pro 13"
- MacBook Pro 16"
- IMac 24"
- Dell XPS Desktop
- Dell Alienare Gaming Desktop





```ruby
factory :computer do
  name { 'Personal Computer' }
  os { Faker::Computer.os }
  ram { %i[gb4 gb8 gb16 gb32].sample }
  cpu { %i[i5 i7 i9 m1 m2].sample }
  located { :work }

  trait :macbook_pro16 do
    name { 'MacBook Pro 16' }
    os { 'macOS 12 Monterey' }
    ram { :gb8 }
    cpu { :m2 }
  end

  trait :xps_desktop  do
    name { 'Dell XPS Desktop' }
    os { 'Windows 11 Home' }
    ram { :gb16 }
    cpu { :i7 }
  end

  trait :for_home do
    located { :home }
  end
end
```

```ruby
FactoryBot.define do
  factory :user do
    name "Friendly User"

    trait :admin do
      admin true
    end

    trait :male do
      gender "Male"
      name   "John Doe"
    end

    trait :female do
      gender "Female"
      name   "Jane Doe"
    end

    trait :teenager do
      date_of_birth { 15.years.ago }
    end

    factory :male_user,                 :traits => [:male]
    factory :female_user,               :traits => [:female]
    factory :teenage_male_user,         :traits => [:teenager, :male]
    factory :teenage_female_user,       :traits => [:teenager, :female]
    factory :male_admin_user,           :traits => [:admin, :male]
    factory :female_admin_user,         :traits => [:admin, :female]
    factory :teenage_admin_male_user,   :traits => [:teenager, :admin, :male]
    factory :teenage_admin_female_user, :traits => [:teenager, :admin, :female]
  end
end
```