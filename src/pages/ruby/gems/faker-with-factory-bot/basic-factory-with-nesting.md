---
layout: ~/layouts/BaseLayout.astro
title: Using nested factories
---

## Overview

Nested factories provide a way to create new named factories via inheritance and is a great way to create multiple factories for the same class without repeating common attributes.

There are two techniques for creating this type of factory, the first is called nested factories embeds one factory inside of another and the second is known as sub-factories uses a `parent: :factory_name` attribute to specify the parent factory.

For all intents and purposes [nested factories](https://github.com/thoughtbot/factory_bot/blob/master/GETTING_STARTED.md#nested-factories) and [sub-factories](https://github.com/thoughtbot/factory_bot/blob/master/GETTING_STARTED.md#assigning-parent-explicitly) are the same. 

They do have slightly different use-case and I'll give my opinion on when you might want to use nested vs sub-factories.

Traits and nested factories also share some similarities, but traits a better for composition while nested factories are good for inheritance - [Is A vs Has A](#traits-vs-nested-factories)


### Nested factory

```ruby
# factories/user.rb
factory :user do
  first_name { 'John' }

  factory :sample_user do
    first_name { FFaker::Name.first_name }
  end
end
```

```ruby 
create :sample_user
```

### Sub-factory

```ruby
# factories/user.rb
factory :user do
  first_name { 'John' }
end

# factories/sample_user.rb OR factories/samples/user.rb
factory :sample_user, parent: :user do
  first_name { FFaker::Name.first_name }
end
```
