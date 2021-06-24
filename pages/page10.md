```

```

# Closures
The idea of closures originated from lambda calculus, and have gotten attention from the family of LISP Programming Languages. Despite the mysterious name, they are nothing but a simple concept - to use variables outside of the current scope.

### Scopes
Scopes are created and destroyed automatically when you invoke a function. They can be thought of as houses for variables, with the creation analogous to allocating rooms for guests, and cleaning to removing the guests. They exists for memory reasons. 
```
func example() {
    # function scope created
    a = 2
    b = "Eggs"
    c = true
    # function scope destroyed
}

example()
```

Inside a scope, you can access items outside the scope and modify them. The definition of the *outer* scope is where the function is being called.
```
#!/run
a = 1  # outer scope
func example() {
    a = 3  # inner scope
}

say("a before=", a)
# function is called here,
# so the outer scope is the global scope containing `a`
example()
say("a after=", a)
```

### Unnamed Functions
There exists a sixth type in Devia, the *Func* type. Functions are data types and can be stored in a variable - they are *First-Class* functions. Functions can be created without a name by simply not including one in its definition, therefore we can pass functions around in variables and even call type functions on them!
```
square = func(x) {
    return x * x
}
# alternatively
square = func(x) x * x

alsoSquare = square
alsoSquare == square  # true

square.arity()  # 1, the number of parameters of the function
```

### Closures
Most programming languages allow functions to be data types, but proper closures have an extra perk. Consider the following:
```
func createAddN(n) {
    return func(x) x + n  # this `n` is part of the function scope
}

addThree = createAddN(3)
addThree(5)  # called here, the outer scope is global
```

The function `createAddN` returns an unnamed function, and we saved this function into the variable `addThree`. But when we call the function `addThree`, the outer scope is by definition the global scope. The global scope does not have the variable `n` that this unnamed function needs. So how does it work here?

All functions are *closures* in Devia. The scope where they are defined are saved in memory, so even if they are passed around throughout other function scopes, they will always have access to the original scope at definition. This is why the variable `n` is still available.

Here is another example:
```
func makeCounter(initial) {
    # part of the `makeCounter` scope
    counter = initial
    
    # unnamed function defined here,
    # saving the function scope, thus the variable `counter`
    return func() {
        counter++  # so we can use `counter` here
        return counter-1
    }
}

increase = makeCounter(1)
increase()  # 1
increase()  # 2
increase()  # 3
```


### Challenges
1. There is a saying that closures are a poor man's custom type. Try to create/recreate the Complex custom type using closures. Hint: try returning a dictionary of unnamed functions as values.
2. There is an undesirable problem with closures and scopes, see if you can recognize it. Hint: think about defining and assigning of variables.
