---
layout: ~/layouts/BaseLayout.astro
title: Using Faker with FactoryBot
# pageTitle: Factory Bot - Guide | AppyDave
# description:
---

Faker and FactoryBot are useful libraries for creating test, seed and sample data for your tests or application.

## Overview

This article will cover common use-cases for using Faker and FactoryBot.

### What is FactoryBot

[Factory Bot](https://github.com/thoughtbot/factory_bot) is a Ruby library that provides factory methods to create test fixtures for automated software testing. It can easily adapted to generating seed and sample data.

> originally known as Factory Girl

The most common use case for FactoryBot is to build *test* data for unit tests.

It has advantages over ruby fixtures because provides a DSL that can keep your data scenarios *DRY*, whilst provide flexibility via associations and callbacks.

A another use case is to build *seed* or *sample* data.

### What is Faker

[Faker](https://github.com/faker-ruby/faker) is a Ruby library for generating fake data such as names, addresses, and phone numbers.

### When is Faker a good fit for

Faker is great when you want to create realistic data quickly.

A common use case is *sample* data for development, integration and UAT environments.

Faker is also be useful for *test* data, but this is not always a desirable use case.

### Should I avoid Faker for unit tests?

It depends, there are compromises that you need to be aware if you use random fake data with unit tests.

*Convention*: Unit tests should have explicit and repeatable inputs.

> Unit testing is about testing a repeatable scenario.

Faker can create unstable tests because, random data can lead to *Flakey* tests that seem to fail randomly, this leads to a lack of confidence in the code.first-letter:

Dynamic tests data in logs is hard to track down in code because you can't search for a static value in the code base.

Random test data can be challenging and costly to reproduce.

*Convention*: Unit tests should have just enough data to meet the test requirement.

> If you use random data, there is a tendency to have a single data factory that fills in every attribute with fake data.

Note: This issue is not limited to Faker data, it can also happen with static values.

*Edge Case*: Random data can unearth unexpected errors.

When using random data, you can accidentally hit edge cases that developers never thought off.

If you really want these random edge cases, then you might want to formalize your testing procedures by using *Monkey* testing

### Faker for *Integration* testing

Integration testing usually has the same compromises as unit testing, so generally you would use well known/static data in the test, but feel free to use Faker for information that is not part of an actual test scenario.

### Faker for *Monkey* testing

[Monkey testing](https://en.wikipedia.org/wiki/Monkey_testing) is a technique for running tests that simulate random user inputs. This can unearth behaviour failures from end-user edge cases that were not thought about.

This type of testing should be separate to unit testing.

### Faker for *Security* testing

Security and penetration testing is different topic to unit testing, but basic idea is that the data inputs are providing active vulnerability testing using various injection strategies, eg. SQL, query params.

There other tools that are better suited to *Security* testing.

### Faker for *Seed* data

You would not usually use Faker (or FactoryBot) for seed data. 

Instead create seed data directly against real models using static data values.

```ruby
class User < ApplicationRecord
end

User.create(name: 'SystemUser', role: 'admin')
```

### Faker for *Sample* data

Sample data for UAT or Development environment is where Faker and FactoryBot can really shine.

```ruby
SeedService.call
# or
SeedService.call(:tech_giant_scenario)

```

```ruby
class SeedService
  include FactoryBot::Syntax::Methods

  class << self
    def seed(variant: :test_data)
      service = SeedService.new
      service.call(variant: variant)
    end
  end

  def call(variant: :sample_data)
    reset
    generate_sample_data          if variant == :sample_data
    generate_tech_giant_scenario  if variant == :tech_giant_scenario
  end

  private

  def reset
    Employee.delete_all
    Company.delete_all
    Region.delete_all
  end

  def generate_sample_data
    regions = create_list(:region, rand(2..5))
    companies = create_list(:company, rand(3..5), region: regions.sample)
    employees = create_list(:employee, rand(10..20), company: companies.sample)
  end

  def generate_tech_giant_scenario
    region_western_sydney = create(:region, :western_sydney)
    region_inner_west = create(:region, :inner_west)

    apple = create(:company, name: 'Apple', region: @region_western_sydney)
    google = create(:company, name: 'Google', region: @region_western_sydney)
    create(:employee, name: 'Lisa', company: google)
    create(:employee, name: 'Bob', company: apple)
  end
end
```