---
layout: ~/layouts/BaseLayout.astro
title: View Component
---

## View Components vs Partials and Presenters

## Overview


A framework for building reusable, testable & encapsulated view components in Ruby on Rails.

Use view_component to DRY up views via a reusable component oriented system.

<!-- 
- [Gem](https://github.com/viewcomponent/view_component)
- [Site](https://viewcomponent.org/)
- [Article](https://dev.to/nejremeslnici/from-partials-to-viewcomponents-writing-reusable-front-end-code-in-rails-1c9o)
 -->

You can also browse, develop, test & document ViewComponents using [Lookbook](https://lookbook.build/guide/)

### What's a ViewComponent

![](/images/ruby/gems/view-component/view-component-overview.png)

### Why use ViewComponents?

ViewComponents work best for templates that are reused or benefit from being tested directly. Partials and templates with significant amounts of embedded Ruby often make good ViewComponents.

## Goal: Clean up three partials

![](https://t6925357.p.clickup-attachments.com/t6925357/bcb3c7b3-9293-405c-8153-8b89bc2ea940/image.png)

The three modal dialog partials are exactly the same accept for the tile and the data endpoint

### Company modal

Update tags via modal dialog for companies

```html
<div class="modal-header">
  <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>
  <h4 class="modal-title text-left"><%= t("manage_tags_for", name: @company.name ) %> </h4>
</div>
<div class="modal-body">

  <span id="tag_manager">
    <%# LOADER WILL BE REMOVED ONCE TAGS ARE LOADED FROM JS %>
    <div class="text-center p-a-3">
      <svg class="spinner" width="40px" height="40px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
        <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
      </svg>
    </div>
  </span>  
</div>
<div class="modal-footer text-right">
  <button class="btn btn-default" data-dismiss="modal"><%= t("close") %></button>
</div>

<style>
  #tag_manager .label { margin-bottom:5px; }
</style>
<script>
  $.get('/tags/manage?context_id=<%= @company.id %>&context_type=Company');

  $('#ajaxModal').on('hide.bs.modal', function () {
    location.reload();
  });
</script>
```

### Contact modal

Update tags via modal dialog for contacts

```html
<div class="modal-header">
  <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>
  <h4 class="modal-title text-left"><%= t("manage_tags_for", name: @contact.name ) %> </h4>
</div>
<div class="modal-body">

  <span id="tag_manager">
    <%# LOADER WILL BE REMOVED ONCE TAGS ARE LOADED FROM JS %>
    <div class="text-center p-a-3">
      <svg class="spinner" width="40px" height="40px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
        <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
      </svg>
    </div>
  </span>  
</div>
<div class="modal-footer text-right">
  <button class="btn btn-default" data-dismiss="modal"><%= t("close") %></button>
</div>

<style>
  #tag_manager .label { margin-bottom:5px; }
</style>
<script>
  $.get('/tags/manage?context_id=<%= @contact.id %>&context_type=Contact');

  $('#ajaxModal').on('hide.bs.modal', function () {
    location.reload();
  });
</script>
```

### Inquiry modal

Update tags via modal dialog for inquiries

```html
<div class="modal-header">
  <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>
  <h4 class="modal-title text-left"><%= t("manage_tags_for", name: @inquiry.name ) %> </h4>
</div>
<div class="modal-body">

  <span id="tag_manager">
    <%# LOADER WILL BE REMOVED ONCE TAGS ARE LOADED FROM JS %>
    <div class="text-center p-a-3">
      <svg class="spinner" width="40px" height="40px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
        <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
      </svg>
    </div>
  </span>  
</div>
<div class="modal-footer text-right">
  <button class="btn btn-default" data-dismiss="modal"><%= t("close") %></button>
</div>

<style>
  #tag_manager .label { margin-bottom:5px; }
</style>
<script>
  $.get('/tags/manage?context_id=<%= @inquiry.id %>&context_type=Inquiry');

  $('#ajaxModal').on('hide.bs.modal', function () {
    location.reload();
  });
</script>
```

### Differences

```html
  <h4 class="modal-title text-left"><%= t("manage_tags_for", name: @company.name ) %> </h4>
  <h4 class="modal-title text-left"><%= t("manage_tags_for", name: @contact.name ) %> </h4>
  <h4 class="modal-title text-left"><%= t("manage_tags_for", name: @inquiry.name ) %> </h4>
```

```javascript
$.get('/tags/manage?context_id=<%= @company.id %>&context_type=Company');
$.get('/tags/manage?context_id=<%= @contact.id %>&context_type=Contact');
$.get('/tags/manage?context_id=<%= @inquiry.id %>&context_type=Inquiry');
```

## Rewrite using ViewComponent

### Component Logic

```ruby
# app/components/update_tags_modal_component.rb
class UpdateTagsModalComponent < ViewComponent::Base
  def initialize(name:, id:, context_type:)
    @name = name
    @id = id
    @context_type = context_type
  end
end
```


### Component HTML

```erb
<%# app/components/update_tags_component.html.erb %>

<div class="modal-header">
  <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>
  <h4 class="modal-title text-left"><%= t("manage_tags_for", name: @name ) %> </h4>
</div>
<div class="modal-body">

  <span id="tag_manager">
    <%# LOADER WILL BE REMOVED ONCE TAGS ARE LOADED FROM JS %>
    <div class="text-center p-a-3">
      <svg class="spinner" width="40px" height="40px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
        <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
      </svg>
    </div>
  </span>  
</div>
<div class="modal-footer text-right">
  <button class="btn btn-default" data-dismiss="modal"><%= t("close") %></button>
</div>

<style>
  #tag_manager .label { margin-bottom:5px; }
</style>
<script>
  $.get('/tags/manage?context_id=<%= @id %>&context_type=<%= @context_type %>');

  $('#ajaxModal').on('hide.bs.modal', function () {
    location.reload();
  });
</script>
```

### Component Usage

```erb
<%# app/views/companies/update_tags_modal.html.erb %>
<%= render(UpdateTagsModalComponent.new(name: @company.name, id: @company.id, context_type: 'Company')) %>
```

## Lookbook

A tool to help browse, develop, test & document ViewComponents in Ruby on Rails apps.

Like Storybook, Lookbook is a frontend workshop for building UI components and pages in isolation. 

- [Lookbook Demo](https://lookbook.build/guide/)
- [Lookbook Gem](https://github.com/allmarkedup/lookbook)

![](https://github.com/allmarkedup/lookbook/raw/main/.github/assets/lookbook_screenshot_v1.0_beta.png)

## Rails Partials - Pricing Chart

However, they are not that great if you need to add some non-trivial logic – a template with more than a few control statements can quickly become messy.

A partial template freely recognizes all instance variables (@variable) and this makes the template tightly coupled with the controller layer where these variables are typically defined. Suppose we’d use a partial template on five different pages: we would have to define the same instance variable(s) in all five actions of the corresponding controllers. Even worse, instance variables default to nil so forgetting to properly set a variable does not raise an exception, instead it can just lead to an unexpected blank output.

Partials and helpers may play together well but they still don’t make a clear unit

### Pricing chart using partials

```erb
<div class="border-b border-gray-200 py-5">
  <h3 class="text-lg font-medium leading-6 text-gray-900">Partials</h3>
  <p class="mt-2 max-w-4xl text-sm text-gray-500">Use Rails Partials to hold the HTML</p>
</div>

<%= render 'price_container' %>
```

### Pricing container partial

```erb
<div class="bg-white">
  <div class="mx-auto max-w-7xl py-24 px-4 sm:px-6 lg:px-8">
    <div class="sm:align-center sm:flex sm:flex-col">
      <h1 class="text-5xl font-bold tracking-tight text-gray-900 sm:text-center">Pricing Plans</h1>
    </div>
    <div class="mt-12 space-y-4 sm:mt-16 sm:grid sm:grid-cols-2 sm:gap-6 sm:space-y-0 lg:mx-auto lg:max-w-4xl xl:mx-0 xl:max-w-none xl:grid-cols-4">
      <%= render 'price_card', locals: { price: '$12', heading: 'Hoby', description: 'All the basics for having fun and make a few bucks', items: ['Potenti felis, in cras at at ligula nunc.', 'Orci neque eget pellentesque.'] } %>
      <%= render 'price_card', locals: { price: '$24', heading: 'Freelancer', description: 'All the basics for starting a new business', items: ['Potenti felis, in cras at at ligula nunc.', 'Orci neque eget pellentesque.', 'Donec mauris sit in eu tincidunt etiam.'] } %>
      <%= render 'price_card', locals: { price: '$32', heading: 'Startup', description: 'What you need to starting building an empire', items: ['Potenti felis, in cras at at ligula nunc.', 'Orci neque eget pellentesque.', 'Donec mauris sit in eu tincidunt etiam.', 'Faucibus volutpat magna.'] } %>
      <%= render 'price_card', locals: { price: '$48', heading: 'Enterprise', description: 'Scalability and reliablity for your business', items: ['Potenti felis, in cras at at ligula nunc.', 'Orci neque eget pellentesque.', 'Donec mauris sit in eu tincidunt etiam.', 'Faucibus volutpat magna.', 'Id sed tellus in varius quisque.', 'Risus egestas faucibus.', 'Risus cursus ullamcorper.'] } %>
    </div>
  </div>
</div>
```

### Pricing card partial

```erb
<div class="divide-y divide-gray-200 rounded-lg border border-gray-200 shadow-sm">
  <div class="p-6">
    <h2 class="text-lg font-medium leading-6 text-gray-900"><%= locals[:heading] %></h2>
    <p class="mt-4 text-sm text-gray-500"><%= locals[:description] %></p>
    <p class="mt-8">
      <span class="text-4xl font-bold tracking-tight text-gray-900"><%=locals[:price] %></span>
      <span class="text-base font-medium text-gray-500">/mo</span>
    </p>
    <a href="#" class="mt-8 block w-full rounded-md border border-gray-800 bg-gray-800 py-2 text-center text-sm font-semibold text-white hover:bg-gray-900">Buy Hobby</a>
  </div>
  <div class="px-6 pt-6 pb-8">
    <h3 class="text-sm font-medium text-gray-900">What's included</h3>
    <ul role="list" class="mt-6 space-y-4">
      <%# Loop through items %>
        <li class="flex space-x-3">
            <svg class="h-5 w-5 flex-shrink-0 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
            </svg>
          <span class="text-sm text-gray-500"><%= item %></span>
        </li>
      <% end %>
    </ul>
  </div>
</div>
```

## View Controllers - Pricing Chart

![](/images/ruby/gems/view-component/price-chart-overview.png)

View Components have an explicit home in the code base. By ”having a home“ we not only mean that view components reside under the app/components folder but also the fact that the code for the component behavior as well as its template live next to each other, in the same place in the code base

The component ruby file supports logic of any complexity. A component is just a ruby class so we can leverage all features of object-oriented programming in them such as private methods, composition, inheritance and just about anything else, if needed. The template file, on the other hand, can stay virtually logic-less.

### Home page view

Pricing chart component getting invoked on a page using *render* or *helper* methods

```erb
<div class="border-b border-gray-200 py-5">
  <h3 class="text-lg font-medium leading-6 text-gray-900">View component</h3>
  <p class="mt-2 max-w-4xl text-sm text-gray-500">View Components are like partials, but with the added benefit of a class that can control logic and easily tested</p>
</div>

<%= render(PriceChartComponent.new(@pricing_data1)) %>

<%= price_chart(@pricing_data2) %>

<%= price_chart(@pricing_data3) %>
```

### Price chart helper

#### helpers/price_chart_helper.rb

```ruby
module PriceChartHelper
  def price_chart(chart_data)
    render PriceChartComponent.new(chart_data)
  end
end
```

### Home controller

```rb
class HomeController < ApplicationController
  def component
    @pricing_data1 = pricing_data_poro
    @pricing_data1.title = nil # let the component set a default title

    @pricing_data2 = pricing_data_poro(3)
    @pricing_data2.cards[1].highlight = true # highlight the second card

    @pricing_data3 = pricing_data_poro(2)
    @pricing_data3.title = 'Only 2 Plans'
  end
```

### Pricing data

```ruby
  private

  def pricing_data_poro(take_cards = nil)
    data = pricing_data
    data[:cards] = data[:cards].take(take_cards) if take_cards
    # OpenStruct is not a good practice: But this makes the HASH and feel like a PORO model
    JSON.parse(data.to_json, object_class: OpenStruct)
  end

  def pricing_data
    {
      title: 'Pricing Plans via Components',
      cards: [
        {
          price: '$12',
          heading: 'Hobby',
          description: 'All the basics for having fun and make a few bucks',
          items: ['Potenti felis, in cras at at ligula nunc.', 'Orci neque eget pellentesque.']
        },
        {
          price: '$24',
          heading: 'Freelancer',
          description: 'All the basics for starting a new business',
          items: ['Potenti felis, in cras at at ligula nunc.', 'Orci neque eget pellentesque.', 'Donec mauris sit in eu tincidunt etiam.']
        },
        {
          price: '$32',
          heading: 'Startup',
          description: 'What you need to starting building an empire',
          items: ['Potenti felis, in cras at at ligula nunc.', 'Orci neque eget pellentesque.', 'Donec mauris sit in eu tincidunt etiam.', 'Faucibus volutpat magna.'] },
        {
          price: '$48',
          heading: 'Enterprise',
          description: 'Scalability and reliablity for your business',
          items: ['Potenti felis, in cras at at ligula nunc.', 'Orci neque eget pellentesque.', 'Donec mauris sit in eu tincidunt etiam.', 'Faucibus volutpat magna.', 'Id sed tellus in varius quisque.', 'Risus egestas faucibus.', 'Risus cursus ullamcorper.']
        }
      ]  
    }
  end
end
```


### Price card component

Setup the business logic for a single price card.

Provide some dynamic logic that effects styling.

#### price_card_component.rb

```ruby
class PriceCardComponent < ViewComponent::Base
  attr_reader :card

  def initialize(card)
    @card = card
    super
  end

  def card_class
    highlight = card.highlight == true ? 'border-7 border-red-500' 
                                       : 'border-gray-200'

    "#{highlight} divide-y divide-gray-200 rounded-lg border border-7 shadow-sm"
  end
end
```

### Price card view

![](/images/ruby/gems/view-component/price-card.png)

#### price_card_component.html.erb

```erb
<div class="<%= card_class %>">
  <div class="p-6">
    <h2 class="text-lg font-medium leading-6 text-gray-900"><%= card.heading %></h2>
    <p class="mt-4 text-sm text-gray-500"><%= card.description %></p>
    <p class="mt-8">
      <span class="text-4xl font-bold tracking-tight text-gray-900"><%= card.price %></span>
      <span class="text-base font-medium text-gray-500">/mo</span>
    </p>
    <a href="#" class="mt-8 block w-full rounded-md border border-gray-800 bg-gray-800 py-2 text-center text-sm font-semibold text-white hover:bg-gray-900">Buy Hobby</a>
  </div>
  <div class="px-6 pt-6 pb-8">
    <h3 class="text-sm font-medium text-gray-900">What's included</h3>
    <ul role="list" class="mt-6 space-y-4">
      <% card.items.each do |item| %>
        <li class="<flex space-x-3>">
            <svg class="h-5 w-5 flex-shrink-0 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
            </svg>
          <span class="text-sm text-gray-500"><%= item %></span>
        </li>
      <% end %>
    </ul>
  </div>
</div>
```

### Price chart component

Handle the display of a list of price cards with custom CSS styling based on the number of price cards provided.

#### price_chart_component.rb

```ruby
class PriceChartComponent < ViewComponent::Base

  CARDS_TWO = 'mt-12 space-y-4 sm:mt-16 sm:grid sm:grid-cols-1 sm:gap-6 sm:space-y-0 lg:mx-auto lg:max-w-4xl lg:max-w-none lg:grid-cols-2'
  CARDS_ODD = 'mt-12 space-y-4 sm:mt-16 sm:grid sm:grid-cols-1 sm:gap-6 sm:space-y-0 lg:mx-auto lg:max-w-4xl lg:max-w-none lg:grid-cols-3 xl:mx-0 xl:max-w-none xl:grid-cols-3'
  CARDS_EVEN = 'mt-12 space-y-4 sm:mt-16 sm:grid sm:grid-cols-1 sm:gap-6 sm:space-y-0 lg:mx-auto lg:max-w-4xl lg:max-w-none lg:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-cols-4'

  def initialize(chart)
    @chart = chart

    @chart.title = 'Pricing Plans' if @chart.title.nil?
    super
  end

  def card_list_class
    return CARDS_TWO if @chart.cards.length == 2
    return CARDS_ODD if @chart.cards.length.odd?

    CARDS_EVEN
  end
end
```

### Price chart view

![](/images/ruby/gems/view-component/price-chart.png)

#### price_chart_component.html.erb

```erb
<div class="bg-white">
  <div class="mx-auto max-w-7xl py-24 px-4 sm:px-6 lg:px-8">
    <div class="sm:align-center sm:flex sm:flex-col">
      <h1 class="text-5xl font-bold tracking-tight text-gray-900 sm:text-center"><%= @chart.title %></h1>
    </div>
    <div class="<%= card_list_class %>">
      <% @chart.cards.each do |card| %>
        <%= render PriceCardComponent.new(card) %>
      <% end %>
    </div>
  </div>
</div>
```

## View Controllers - Unit Tests

![](/images/ruby/gems/view-component/price-card-unit-test.png)

### Setup RSpec data

```ruby
require "rails_helper"

RSpec.describe PriceCardComponent, type: :component do
  let(:component) { described_class.new(card) }
  let(:card) { JSON.parse(data.to_json, object_class: OpenStruct) }

  # play with :data to test different scenarios
  let(:data) { raw_data }

  let(:raw_data) do
    {
      price: '$12',
      heading: 'Hobby',
      description: 'All the basics for having fun and make a few bucks',
      items: ['Potenti felis, in cras at at ligula nunc.', 'Orci neque eget pellentesque.']
    }
  end
```

### Test Component class

```ruby
  context '.card' do
    subject { component.card }
  
    it { is_expected.not_to be_nil }

    it 'has attributes' do
      expect(component.card.price).not_to be_nil
      expect(component.card.heading).not_to be_nil
      expect(component.card.description).not_to be_nil
      expect(component.card.items).not_to be_nil
      expect(component.card.items).to be_a(Array)
    end    
  end

  context '.card_class' do
    subject { component.card_class }

    it { is_expected.to eq('divide-y divide-gray-200 rounded-lg border border-7 shadow-sm border-gray-200') }
  
    context 'when card.highlight is true' do
      let(:data) { raw_data.merge(highlight: true) }

      it { is_expected.to eq('divide-y divide-gray-200 rounded-lg border border-7 shadow-sm border-red-500') }
    end
  end
```

### Check rendered HTML

```ruby
  context '#render' do
    subject { page }
    before { render_inline(component) }

    it { is_expected.to have_text("All the basics for having fun and make a few bucks") }

    context 'when list item exists' do
      it { is_expected.to have_css('li.flex.space-x-3') }
    end

    context 'when list item does not exist' do
      let(:data) { raw_data.merge(items: []) }

      it { is_expected.not_to have_css('li.flex.space-x-3') }
    end
  end
end
```

### Outcome

![](/images/ruby/gems/view-component/price-chart.png)

## Presenters - Select2 Dropdown

### Base presenter

```ruby
class BasePresenter
  def call
    raise NoMethodError, "implement the call method in your presenter object"
  end

  private

  def validate_outputs
    @required_outputs.each do |output|
      if @outputs[output].nil?
        raise ArgumentError, "#{self.class} missing required output '#{output}'"
      end
    end
  end

  class << self
    def present(*arguments)
      self.new(*arguments).call
    end

    def outputs(*outputs, required: false)
      outputs.each do |output|
        define_method(output) do
          @outputs[output]
        end
        define_method("#{output}=") do |value|
          @outputs[output] = value
        end
      end
      self.required_outputs.concat(outputs) if required
    end

    def required_outputs
      @required_outputs ||= []
    end

    def inherited(subclass)
      interceptor = const_set("#{subclass.name.split('::').last}Interceptor", Module.new)
      interceptor.define_method(:call) do
        super()
        validate_outputs
        OpenStruct.new(@outputs)
      end
      interceptor.define_method(:initialize) do |*arguments|
        @outputs = {}
        @required_outputs = subclass.required_outputs
        super(*arguments)
      end
      subclass.prepend(interceptor)
    end
  end
end
```

### Select2 presentor

```ruby
class SelectPresenter < BasePresenter
  outputs :dom_id, :select_arguments, :config, required: true

  def initialize(*select_arguments)
    @select_arguments = *select_arguments
  end

  def call
    set_dom_id
    set_select_arguments
    set_config
  end

  private

  def set_dom_id
    self.dom_id = sanitize_to_id(@select_arguments.first)
  end

  def set_select_arguments
    self.select_arguments = @select_arguments
  end

  def set_config
    self.config = {
      theme: "bootstrap",
      minimumResultsForSearch: 99999
    }
  end

  def sanitize_to_id(name)
    name.to_s.delete("]").tr("^-a-zA-Z0-9:.", "_")
  end
end
```

### Select2 view

```erb
<%= select_tag(*vm.select_arguments) %>

<script type="text/javascript">
  if (typeof $ !== 'undefined' && typeof $.fn.select2 !== 'undefined') {
    $("#<%= vm.dom_id %>").select2(<%= vm.config.to_json.html_safe %>);
  }
</script>

<% content_for :page_scripts do %>
  <script type="text/javascript">
    if (!$("#<%= vm.dom_id %>").data('select2')) {
      $("#<%= vm.dom_id %>").select2(<%= vm.config.to_json.html_safe %>);
    }
  </script>
<% end %>
```

### Select2 helper

```ruby
module SelectHelper
  def select2_tag(*arguments)
    render "_presentables/select", vm: SelectPresenters.present(*arguments)
  end

  def sales_rep_select(name, selected, options={})
    render "_presentables/select", vm: SalesRepSelectPresenter.present(name, @tenant, selected, options)
  end
end
```

### Select2 (Custom presenter)

> Should SalesRepSelectPresenter use composition over inheritence

```ruby
class SalesRepSelectPresenter < SelectPresenter
  def initialize(name, tenant, selected, options={})
    @name = name
    @tenant = tenant
    @selected = selected
    @options = options
    @options[:user_list] = :all if !valid_user_list_options.include?(@options[:user_list])
    @options[:extra_entries] = {} if @options[:extra_entries].nil?
    @options[:extra_entries] = {all: true, empty: true}.merge(@options[:extra_entries])
  end

  private

  def set_dom_id
    self.dom_id = sanitize_to_id(@name)
  end

  def set_select_arguments
    list = []
    context_ids = []
    user_ids = []
    location_ids = []

    if [SalesRep, User, Location].include?(@selected.class)
      @selected = SalesRep.context_identifier(@selected)
    end

    sales_reps = SalesRep.unscoped.where(tenant: @tenant, deleted: false).where(add_in_table_list: true)
    sales_reps.each do |sales_rep|
      selected_sales_rep = false
      context = sales_rep
      context = sales_rep.user if sales_rep.user
      context = sales_rep.location if @tenant.sales_rep_for_locations && sales_rep.location

      id = SalesRep.context_identifier(context)

      should_show = true
      case context.class.to_s
      when "SalesRep"
        should_show = false if [:users, :mapped].include?(@options[:user_list])
        name = sales_rep.name || I18n.t("unknown")
        name = "#{name} (#{I18n.t("unmapped")})"
      when "User"
        should_show = false if [:unmapped].include?(@options[:user_list])
        name = sales_rep.user.full_name
        user_ids << context.id
      when "Location"
        should_show = false if [:unmapped].include?(@options[:user_list])
        name = sales_rep.location.name
        location_ids << context.id
      end

      next if context_ids.include?(id)
      context_ids << id
      list << [name, id] if should_show || id == @selected
    end

    translated_empty_text = I18n.t("no_salesrep_defined")
    translated_all_text = I18n.t("all_users")
    if @tenant.sales_rep_for_locations
      @tenant.locations.each do |location|
        next if location_ids.include?(location.id)
        id = "l_#{location.id}"
        name = location.name
        list << [name, id] if [:all, :users].include?(@options[:user_list]) || id == @selected
      end
      translated_empty_text = I18n.t("no_location")
      translated_all_text = I18n.t("all_locations")
    else
      @tenant.visible_users.each do |user|
        next if user_ids.include?(user.id)
        id = "u_#{user.id}"
        name = user.full_name
        list << [name, id] if [:all, :users].include?(@options[:user_list]) || id == @selected
      end
    end

    list.sort_by! { |s| s.first }
    list.unshift([translated_empty_text, "empty"]) if @options[:extra_entries][:empty]
    list.unshift([I18n.t("none"), "none"]) if @options[:extra_entries][:none]
    list.unshift(["- #{I18n.t("keep_current")} -", "current"]) if @options[:extra_entries][:current]
    list.unshift([translated_all_text, "all"]) if @options[:extra_entries][:all]

    self.select_arguments = [@name, ActionController::Base.helpers.options_for_select(list, @selected), @options]
  end

  def valid_user_list_options
    [:all, :users, :sales_reps, :unmapped, :mapped]
  end
end
```
