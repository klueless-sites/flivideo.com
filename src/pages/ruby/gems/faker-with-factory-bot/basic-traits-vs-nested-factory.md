---
layout: ~/layouts/BaseLayout.astro
title: Traits vs nested factories
---

## Overview

Traits and nested factories also share some similarities and it is not always obvious when you would use traits vs nested factories.

I need an user with the Admin role for a unit test. Should I use a traits or nested factories to create the Admin user?

### Using traits

```ruby
factory :user do
  role { 'customer' }

  trait :admin do
    role { 'admin' }
  end
end
```

```ruby
@admin_user = create(:user, :admin)
```

### Using nested factory

```ruby
factory :user do
  role { 'customer' }

  factory :admin_user do
    role { 'admin' }
  end
end
```

```ruby
@admin_user = create(:admin_user)
```

## Inheritance vs Composition

To use nested factories and traits together, you need to understand that they solve different modeling problems.

In OOP there are two different ways of modeling relationships. Inheritance (IS-A) vs. Composition (HAS-A).

In FactoryBot you can model this relationship using a Nested factory (IS-A) or a Trait (HAS-A)

### IS A

Establishes relationships between objects via inheritance

  - A cat **IS** a type of *pet*
  - A dog **IS** a type of *pet*
  - A rabbit **IS** a type of *pet*

### Nested Factory

```ruby
factory :pet do
  owner
  name { 'Fluffy' }
  type { :unknown }

  factory :pet_cat do
    name { Faker::Creature::Cat.name }
    type { :cat }
  end

  factory :pet_dog do
    name { Faker::Creature::Dog.name }
    type { :dog }
  end

  factory :pet_rabbit do
    type { :rabbit }
  end
end
```

```ruby
@fluffy = create(:pet_rabbit)
@puddy = create(:pet_cat)
@woofer = create(:pet_dog)
```

### HAS A

Establishes relationships between objects via composition.

  - A *computer* **HAS** a CPU
  - A *computer* **HAS** a Ram
  - A *computer* **HAS** a Operating System


### Traits

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
@work_laptop = create(:computer, :macbook_pro16)
@work_desktop = create(:computer, :xps_desktop)
@home_computer = create(:computer, :xps_desktop, :for_home)
```

