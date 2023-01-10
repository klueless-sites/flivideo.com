


- [Research 1](https://avdi.codes/classnew-and-inherited/)
- [Research 2]()
- [Research ]()
- [Research ]()
- [Research ]()
- [Research ]()


### Class.new with inheritance

Google: rspec let class.new with inheritance

```ruby
class Parent
end

klass = Class.new(Parent)
klass.superclass #=> Parent

# or if you were using RSpec, you might do the following
class CoolBase
  def temperature
    'cold'
  end
end

RSpec.describe CoolBase do
  let(:coolio) do
    Class.new(described_class) do
      def say_it
        "It is really #{temperature}"
      end
    end
  end

  it { expect(coolio.new.say_it).to eq 'It is really cold' }
end
```