---
layout: ~/layouts/BaseLayout.astro
title: Pretty Call Stack in Ruby
---

## Overview

# You can use Kernel#caller
```ruby
puts caller
```

# Or if you want to remove bin/bundle, lib/ruby/gems/* etc from the stack.

# you can can filter for unique application path entry or other exclusions as needed.
```ruby
def call_stack(app_path_identifier)
  # some filter that is unique to your application path, add exclusions as needed
  stack = caller.select { |i| i.include?(app_path_identifier) }
  # example stack item: /Users/xmen/dev/my_company/my_app/app/presenters/base_presenter.rb:90:in `block (2 levels) in outputs'"
  # callee            : base_presenter.rb:90
  puts caller
  {
    callee: stack.first.split('/').last.split(':')[0,2].join(':'),
    stack: stack
  }
end
```
