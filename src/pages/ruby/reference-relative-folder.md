---
layout: ~/layouts/BaseLayout.astro
title: Referencing Relative Files
---

## Overview

Finding a file or path that is relative to current file in ruby

```ruby
# You can get current directory (directory of current file) with this

File.dirname(__FILE__)

# You can then join it with relative path to the root

File.join(File.dirname(__FILE__), '../../')

# Or you can use expand_path to convert relative path to absolute.

File.expand_path('../../Gemfile', File.dirname(__FILE__))
```

### Fixed Folder Location for Unit Tests

I often want to have a fixed folder location in my unit tests for storing some kind of data file. I could use the relative path technique but that mean I have to keep changing the relative path based on the location of the spec file

My technique is to create a constant in my spec helper

#### spec_helper.rb
```
SPEC_FOLDER = File.dirname(__FILE__)

RSpec.configure do |config|
  # ...
end
```

When I need to access some mock data, I don't need to worry about the data file relative to the spec file.


#### a/b/c/test1_spec.rb
```ruby
require 'spec_helper'

# /Users/davo/dev/kgems/tailwind_dsl/spec/tailwind_dsl/transformers/component_structures
RSpec.describe TailwindDsl::Transformers::ComponentStructures::Transformer do
  # Go up 3 parent folders
  let(:design_systems_file1) { File.expand_path('../../../samples/input/uikit.json', File.dirname(__FILE__)) }
  # Always constant
  let(:design_systems_file2) { File.join(SPEC_FOLDER, 'samples/input/uikit.json') }

  it 'check mock data' do
    puts SPEC_FOLDER
    puts design_systems_file1
    puts design_systems_file2
    puts File.dirname(__FILE__)
  end
end
```

```bash
/Users/davo/dev/kgems/tailwind_dsl/spec
/Users/davo/dev/kgems/tailwind_dsl/spec/samples/input/uikit.json
/Users/davo/dev/kgems/tailwind_dsl/spec/samples/input/uikit.json
/Users/davo/dev/kgems/tailwind_dsl/spec/tailwind_dsl/transformers/component_structures
```

#### a/b/c/d/test2_spec.rb

```ruby
require 'spec_helper'

# /Users/davidcruwys/dev/kgems/tailwind_dsl/spec/tailwind_dsl/transformers/raw_components/schema
RSpec.describe TailwindDsl::Transformers::RawComponents::Schema::DesignSystem do
  # Go up 4 parent folders
  let(:design_systems_file1) { File.expand_path('../../../../samples/input/uikit.json', File.dirname(__FILE__)) }
  # Always constant
  let(:design_systems_file2) { File.join(SPEC_FOLDER, 'samples/input/uikit.json') }

  it 'check mock data' do
    puts SPEC_FOLDER
    puts design_systems_file1
    puts design_systems_file2
    puts File.dirname(__FILE__)
  end
end
```

```bash
/Users/davo/dev/kgems/tailwind_dsl/spec
/Users/davo/dev/kgems/tailwind_dsl/spec/samples/input/uikit.json
/Users/davo/dev/kgems/tailwind_dsl/spec/samples/input/uikit.json
/Users/davo/dev/kgems/tailwind_dsl/spec/tailwind_dsl/transformers/component_structures
```
