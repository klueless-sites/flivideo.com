---
layout: ~/layouts/BaseLayout.astro
title: Provide an Alias for a Factory 
---

## Overview

Aliases allow you to defined another name for an existing factory.

This is handy when you are referencing an association when the attribute name does not match the class name.

### Without aliases

When you access an association where the attribute does not match the class, you can defined this connection using implicit or explicit associations.

#### Example using implicit and explicit associations

```ruby
factory :user do
  first_name { "John" }
  last_name { "Doe" }
end

factory :account do
  # implicit
  owner factory: :user
  title { "Primary Account" }
end

factory :post do
  # explicit
  association :author, factory: :user
  title { "Article on FactoryBot" }
  body { "Here are 5 different use cases" }
end
```

### With aliases

You can cleanup the above code by using aliases

```ruby
factory :user, aliases: [:owner, :author] do
  first_name { "John" }
  last_name { "Doe" }
end

factory :account do
  owner
  title { "Primary Account" }
end

factory :post do
  author
  title { "Article on FactoryBot" }
  body { "Here are 5 different use cases" }
end
```

### Should you use aliases?

This is up to you and your team to decide?

**Use factory: :name_of_factory** - Your factory explicitly shows any developer that the association is linked to the user. Explicit code is easy to understand.

You can see straight away that an author is of type `User`

```ruby
factory :post do
  association :author, factory: :user
end
```

**Use aliases** - The factory association type is obscure, a developer not familiar with the code base may wonder

> Where is this `Author` class?

```ruby
factory :post do
  author
end
```

