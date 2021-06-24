```

```

# Containers & Custom Types
We often need more types than simply numbers and strings. There exists two *container* types in Devia: list and dictionary, which is introduced here. One can also make custom types, they behave like *dictionaries* that you can attach type functions onto.

### Containers
Lists are growable *arrays* that is ordered. The types in a list can be different from each other. 
```
list(1, 2, 3)  # list of numbers
list("Monday", 2, false, null)
list(list(1, 2), list(3, 4))
```

Dictionaries are growable *hashmaps* that are unordered. They can only have strings or numbers as indexes.
```
dict(one: 1, two: 2)
dict(1: "one", 2: "two")
```

To store and access the items inside these containers, use the `.get(key)` and `.set(key, value)` type functions. The *keys* in a list are the n of the nth element; and are the key of the keys in a dictionary.
```
a = list("Monday", "Tuesday", "Wednesday")
say(a.get(2))  # "Tuesday"

b = dict(one: 1, two: 2)
b.set("one", 3)
# b is now dict(one: 3, two: 2)
```

A syntax sugar for container types are the use of dot notations. They can be used if you are sure of the key when writing the program.
```
a.1
a.3 = 12

b.one
b.two = 4
```

Since all container types satisfy the `.iter()` type function, use the *each..of* loop to traverse each item/key of a container.
```
#!/run
a = list(23, 12, 56)
each number, index of a {
    say("index=", index, "number=", number)
}
```

The `range` function can be used create a list of sequential numbers. It is *lazy* for performance reasons, so use `eval` to return a list.
```
a = eval(range(10))  # to make a list

# or use it in a loop
each i of range(5) {}
```

### Custom Types
Custom Types need to be *defined* before usage. Use the *type* keyword to define a custom type, with its *members* specified in parentheses. If there is no parenthesis, it will assume that the type have no *members*.
```
type Person(name, age)
type Deviation  # the same as `type Deviation()`
```

To make an *instance* of a type, invoke the name of the type like you do with a function. If there is no constructor, it will be expecting arguments the length and order of the members in definition. You can then treat the instance as a dictionary.
```
me = Person("Me", 18)
me.name      # "Me"
me.age = 20  # set age to 20
```

You can add type functions to custom types, allowing for a constructor, which can override the default constructor using the order of the type's members. Operator overriding is also possible with similar syntax.
```
#!/run
type Person(name, age)

impl new(self, name) for Person {
    self.name = name
    self.age = 18
}

# the constructor is overriden
you = Person("you")
you.age  # 18

impl detail(self) for Person {
    return "Person '\(self.name)', age \(self.age)"
}

say(you.detail())
```

```
type Number(number)

impl add(self, other) for Number {
    return Number(self.number + other.number)
}

impl +(self, other) for Number {
    return Number(self.number + other.number)
}

a = Number(12)
b = Number(13)

a.add(b) == a + b  # true
```

By using the dot notation of the name of the type, not the instance, you can still use the type function.
```
#!/run
type Greeter

# no `self`
impl greet(name) for Greeter {
    say("Greetings, \(name)")
}

Greeter.greet("Terry")
```

### Congratulations
You have now mastered a large portion of the Deviation Programming Language. However, I still highly recommend you attempt the later chapters. Not only are they useful for an advance user, they are also fun to do!

### Challenges
1. Make a todo list that can: add, view, and, complete todos.
2. If you've touched on complex numbers, try to make a custom type *Complex* that have the members *real* and *imag*. Override their operators, and the *.str* type function, which causes *say()* to print your custom type more prettily.
