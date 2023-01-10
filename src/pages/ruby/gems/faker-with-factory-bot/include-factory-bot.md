---
layout: ~/layouts/BaseLayout.astro
title: FactoryBot::Syntax::Methods
# pageTitle: Factory Bot - Guide | AppyDave
# description:
---

## Explicit use of FactoryBot

Example of using FactoryBot in a RSpec

```ruby
RSpec.describe User, type: :model do
  let(:user) { FactoryBot.create(:user, :admin) }

  context 'user' do
    subject { user }
  
    it { is_expected.not_to be_nil }
  end
end
```

## Implicit use of FactoryBot

To use FactoryBot implicitly you need to include the helper methods in your Specs or data generation classes.

### Configure for RSpec

```ruby
RSpec.configure do |config|
  config.include FactoryBot::Syntax::Methods
end
```

FactoryBot namespace can be removed in Rspec

```ruby
RSpec.describe User, type: :model do
  # let(:user) { FactoryBot.create(:user, :admin) }
  let(:user) { create(:user, :admin) }
end
```

### Configure for data classes

```ruby
class Seed
  include FactoryBot::Syntax::Methods

  def generate
    create(:user)
  end
end
```

### Be aware of the new methods on the class

You can find the list of [FactoryBot Methods](https://www.rubydoc.info/gems/factory_bot/FactoryBot/Syntax/Methods)


```ruby
class Seed
  include FactoryBot::Syntax::Methods

  def generate
    # coordinate data creation here
  end

  # Methods like

  private

  # Thesa methods will override FactoryBot::Syntax::Methods
  def create
    # create something
  end

  def build
    # build something
  end
end
```
