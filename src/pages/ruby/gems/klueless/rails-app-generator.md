---
layout: ~/layouts/BaseLayout.astro
title: Rails App Generator
---

## Overview

Create new Rails Application with custom opinions

| As a Developer, I want to create new Rails application with flexible opinions so that I can build different rails proof of concepts

`rails new` uses a batteries included approach, this means that you get everything and if you don't want a feature you need to turn it off explicitly using --skip-feature. 

This GEM tries to change the focus so that you get very minimal installation and then you turn on what you want explicitly.

### Use the Gem

```bash
rag rag-simple
rag rag-tailwind
rag rag-bootstrap
```

## Extending Rails App Generator

### Create new Addon

If you need to make a new addon available then use `thor addon:new`

Generally an Addon will be for a an existing Ruby GEM so if you use the --gem option, it will bring in the GEM info such as latest version number.

```bash
thor addon:new image_processing --gem
thor addon:new kaminari --gem
```

### Create new Profile

A profile is a sample Rails application template with files that allows you to test one or more Addons and produces a working Rails 7 application.

If you are just keeping the example to a simple GEM then use the --variant option with the folder you would like to write code into, e.g. addons

```bash
thor profile:new factory_bot --variant=addons
thor profile:new kaminari --variant=addons
```

## Examples


### Create addons

Some of the addons that have been created

```bash
exe/rag addon/rails_html_sanitizer
exe/rag addons/acts_as_list
exe/rag addons/administrate
exe/rag addons/annotate
exe/rag addons/avo
exe/rag addons/bcrypt
exe/rag addons/bcrypt_ruby
exe/rag addons/brakeman
exe/rag addons/browser
exe/rag addons/bundler_audit
exe/rag addons/chartkick
exe/rag addons/devenv
exe/rag addons/devise
exe/rag addons/devise_masquerade
exe/rag addons/dotenv
exe/rag addons/factory_bot
exe/rag addons/factory_bot_rails
exe/rag addons/faker
exe/rag addons/friendly_id
exe/rag addons/generators
exe/rag addons/hexapdf
exe/rag addons/honeybadger
exe/rag addons/httparty
exe/rag addons/kaminari
exe/rag addons/lograge
exe/rag addons/minimal_css
exe/rag addons/mini_magick
exe/rag addons/motor_admin
exe/rag addons/phony_rails
exe/rag addons/pretender
exe/rag addons/public_suffix
exe/rag addons/redcarpet
exe/rag addons/rolify
exe/rag addons/rspec
exe/rag addons/rubocop
exe/rag addons/scenic
exe/rag addons/twilio_ruby
```

### Create sample applications


```bash
exe/rag application/klueless
exe/rag application/printspeak


exe/rag rag-add-some-pages
exe/rag rag-bootstrap
exe/rag rag-bootstrap.json
exe/rag rag-devise
exe/rag rag-import-map
exe/rag rag-printspeak
exe/rag rag-sample
exe/rag rag-simpl
exe/rag rag-simple
exe/rag rag-tailwind
exe/rag rag-tailwind-daisyui
exe/rag rag-tailwind-emulating-bootstrap
exe/rag rag-tailwind-flash
exe/rag rag-tailwind-form
exe/rag rag-tailwind-hotwire
exe/rag rag-tailwind-hotwire-flash
exe/rag rag-tailwind-hotwire-form
exe/rag rag-tailwind-hotwire-form-search
exe/rag rag-tailwind-style-resuse
exe/rag rag-tailwind-style-reuse
exe/rag rag-test
exe/rag rag/bootstrap
exe/rag rag/devise
exe/rag rag/import-map
exe/rag rag/printspeak
exe/rag rag/sample
exe/rag rag/simple
exe/rag rag/tailwind
exe/rag rag/tailwind-daisyui
exe/rag rag/tailwind-emulating-bootstrap
exe/rag rag/tailwind-hotwire
exe/rag rag/tailwind-hotwire-flash
exe/rag rag/tailwind-hotwire-form
exe/rag rag/tailwind-hotwire-form-search
exe/rag rag/test
exe/rag rag/testy
```

### Diff two projects

```bash
exe/rag diff --help
exe/rag diff a/addons/r7_devise_masquerade a/addons/devise_masquerade_sample --open-different=true
exe/rag diff a/rag/simple a/rag/import_map
exe/rag diff a/rag/simple a/rails/simple
exe/rag diff a/rag/simple a/rails/simple --lhs
exe/rag diff a/rag/simple a/rails/simple --lhs --rhs
exe/rag diff a/rag/simple a/rails/simple --lhs --rhs --compare
exe/rag diff a/rag/simple a/rails/simple --lhs --rhs --diff
exe/rag diff a/rag/simple a/rails/simple --lhs --rhs --diff --compare
exe/rag diff a/rag/simple a/rails/simple --lhs --rhs --skip-empty-files=false
exe/rag diff a/rag/simple a/rails/simple --open-left-only
exe/rag diff a/rag/simple a/rails/simple --open-left-only=true
exe/rag diff a/rag/simple a/rails/simple --open-left-only=true --show-left-only
exe/rag diff a/rag/simple a/rails/simple --show-left-only --show-right-only --show-same --show-different
exe/rag diff a/rag/tailwind_hotwire_form a/rag/tailwind_hotwire_form2
```