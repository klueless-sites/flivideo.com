---
layout: ~/layouts/BaseLayout.astro
title: JSON Serialization Techniques
---

read these:


- [ToJson](https://docs.ruby-lang.org/en/master/JSON.html#module-JSON-label-Parsing+JSON+Scalars)
- [Q&A 1](https://stackoverflow.com/questions/53899249/json-deserialization-in-ruby)
- [Q&A 2](https://stackoverflow.com/questions/4464050/ruby-objects-and-json-serialization-without-rails)
- [Q&A 3](https://stackoverflow.com/questions/4569329/serialize-ruby-object-to-json-and-back)
- [Q&A 4](https://stackoverflow.com/questions/52333571/how-to-serialize-deserialize-ruby-hashes-structs-with-objects-as-keys-to-json)
- [Q&A 5](https://stackoverflow.com/questions/66296662/why-do-we-need-ruby-serializer-libraries)
- [Q&A 6](https://skorks.com/2010/04/serializing-and-deserializing-objects-with-ruby/)
- [Q&A 7](https://ruby-doc.org/stdlib-2.6.4/libdoc/json/rdoc/JSON.html)
- [Q&A 8](https://blog.kiprosh.com/serialization_in_ruby_on_rails_part_one/)
- [Q&A 9](https://dev.to/appland/how-to-safely-deserialize-data-in-ruby-on-rails-4mbl)
- [Q&A 10](https://buttercms.com/blog/json-serialization-in-rails-a-complete-guide/)
- [Q&A 11](https://stackoverflow.com/questions/3504658/generate-ruby-classes-from-json-document)
- [Q&A 12](https://stackoverflow.com/a/54500640)
- [Q&A 13](https://stackoverflow.com/a/4569403)
- [Q&A 14](https://news.ycombinator.com/item?id=31567755)
- [Q&A 15](https://github.com/vasilakisfil/SimpleAMS)
- [Q&A 16](https://stackoverflow.com/a/4464721)
- [Q&A 17]()
- [Q&A 18]()

## Overview

Why is it so hard to Read, Write, Edit JSON in Ruby using Rubo objects?

I want to be interact with JSON documents using class/attribute syntax instead of Hash syntax.

I want to read, write and edit these documents.

I want work with single root and array root JSON.

I will explore four techniques to do this in Ruby.

- Class (Poro)
  - NOTE: with this this technique you should use **args or if you have other params, maybe **_args to handle the case where data is supplied that your initializer does not specifically handle. 
- Struct
- OpenStruct
- Dry-Types (Dry Struct, Dry Initializer)
- Trailblazer (Representable) https://github.com/trailblazer/representable

## Sample using Struct

The following example takes a normalized JSON document and maps it to a denormalized record `Struct`, which is composed using subtypes primarily to give handy namespaces to the different data objects.

### Sample JSON

Hierarchy with the following structure

- Many design systems
  - Many groups under each design systems.
    - Many source files under each group
      - One to one relationship between source file and target components

```json
{
  "design_systems": [
    {
      "name": "tui",
      "stats": {
        "marketing.section.cta": 3
      },
      "groups": [
        {
          "key": "marketing.section.cta",
          "type": "cta",
          "folder": "marketing/section/cta",
          "sub_keys": [
            "marketing",
            "section",
            "cta"
          ],
          "files": [
            {
              "name": "03.html",
              "file_name": "03.html",
              "file_name_only": "03",
              "file": "marketing/section/cta/03.html",
              "target": {
                "html_file": "marketing/section/cta/03.html",
                "clean_html_file": "marketing/section/cta/03.clean.html",
                "tailwind_config_file": "marketing/section/cta/03.tailwind.config.js",
                "settings_file": "marketing/section/cta/03.settings.json",
                "data_file": "marketing/section/cta/03.data.json",
                "astro_file": "marketing/section/cta/03.astro"
              }
            },
            {
              "name": "02.html",
              "file_name": "02.html",
              "file_name_only": "02",
              "file": "marketing/section/cta/02.html",
              "target": {
                "html_file": "marketing/section/cta/02.html",
                "clean_html_file": "marketing/section/cta/02.clean.html",
                "tailwind_config_file": "marketing/section/cta/02.tailwind.config.js",
                "settings_file": "marketing/section/cta/02.settings.json",
                "data_file": "marketing/section/cta/02.data.json",
                "astro_file": "marketing/section/cta/02.astro"
              }
            }
          ]
        }
      ]
    }
  ]
}
```

### Query object mapping to Struct

The result from this class is a flattened list of records.

```ruby
components = TailwindDsl::Etl::ComponentQuery.query

components.each |component|
  puts "Information Design System"
  puts component.design_system.to_h

  puts "Information about the group"
  puts component.group.to_h

  puts "Relative file name information about the component"
  puts component.relative.to_h

  puts "Absolute file name information about the component"
  puts component.absolute.to_h
end
```

```ruby
module TailwindDsl
  module Etl
    class ComponentQuery
      DesignSystem = Struct.new(
        :name,
        :source_path,
        :target_path,
        keyword_init: true
      )

      ComponentGroup = Struct.new(
        :key,
        :type,
        :sub_keys,
        keyword_init: true
      )
      ComponentInfo = Struct.new(
        :source_file,
        :target_html_file,
        :target_clean_html_file,
        :target_tailwind_config_file,
        :target_settings_file,
        :target_data_file,
        :target_astro_file, keyword_init: true
      )

      class Record
        attr_reader :design_system
        attr_reader :group
        attr_reader :absolute
        attr_reader :relative

        def initialize(design_system:, group:, absolute:, relative:)
          @design_system = design_system
          @group = group
          @absolute = absolute
          @relative = relative
        end

        def to_h
          {
            design_system: design_system.to_h,
            group: group.to_h,
            absolute: absolute.to_h,
            relative: relative.to_h
          }
        end
      end

      attr_reader :uikit
      attr_reader :raw_component_root_path
      attr_reader :component_structure_root_path
      attr_reader :current_design_system
      attr_reader :debug
      attr_reader :records

      def initialize(uikit, **args)
        @uikit = uikit
        @raw_component_root_path = args[:raw_component_root_path] || raise(ArgumentError, 'Missing raw_component_root_path')
        @component_structure_root_path = args[:component_structure_root_path] || raise(ArgumentError, 'Missing component_structure_root_path')
        @debug = args[:debug] || false
      end

      class << self
        def query(uikit, raw_component_root_path:, component_structure_root_path:, debug: false)
          instance = new(uikit, raw_component_root_path: raw_component_root_path, component_structure_root_path: component_structure_root_path, debug: debug)
          instance.call
        end
      end

      def call
        @records = build_records

        self
      end

      # Flattened list of records in hash format
      # @return [Array<Hash>] list
      def to_h
        records.map(&:to_h)
      end

      private

      def build_records
        uikit.design_systems.flat_map do |design_system|
          @current_design_system = design_system
          design_system.groups.flat_map do |group|
            group.files.map do |file|
              Record.new(
                design_system: DesignSystem.new(**map_design_system),
                group: ComponentGroup.new(**map_group(group)),
                absolute: ComponentInfo.new(**map_absolute_file(file)),
                relative: ComponentInfo.new(**map_relative_file(file))
              )
            end
          end
        end
      end

      def design_system_name
        current_design_system.name
      end

      def source_path
        File.join(raw_component_root_path, design_system_name)
      end

      def target_path
        File.join(component_structure_root_path, design_system_name)
      end

      def map_design_system
        {
          name: design_system_name,
          source_path: source_path,
          target_path: target_path
        }
      end

      def map_group(group)
        {
          key: group.key,
          type: group.type,
          sub_keys: group.sub_keys
        }
      end

      def map_relative_file(file)
        {
          source_file: file.file,
          target_html_file: file.target.html_file,
          target_clean_html_file: file.target.clean_html_file,
          target_tailwind_config_file: file.target.tailwind_config_file,
          target_settings_file: file.target.settings_file,
          target_data_file: file.target.data_file,
          target_astro_file: file.target.astro_file
        }
      end

      def map_absolute_file(file)
        {
          source_file: File.join(source_path, file.file),
          target_html_file: File.join(target_path, file.target.html_file),
          target_clean_html_file: File.join(target_path, file.target.clean_html_file),
          target_tailwind_config_file: File.join(target_path, file.target.tailwind_config_file),
          target_settings_file: File.join(target_path, file.target.settings_file),
          target_data_file: File.join(target_path, file.target.data_file),
          target_astro_file: File.join(target_path, file.target.astro_file)
        }
      end
    end
  end
end
```



