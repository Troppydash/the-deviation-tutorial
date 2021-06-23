```
# builtin functions and type functions 
# are listed at the end of this tutorial
```

# Functions & Type Functions

Functions are lines of code that is saved in a variable. The **callee** can **invoke** or **call** a function to run the lines of code, passing **arguments** to make the function run differently. Functions always returns something, and the **caller** can use this value.

### Definition
Regular functions are defined with the *func* keyword, followed by a name and a list of **parameters**, which are the inputs for the function. Then in curly braces, are the lines of code.

The following function called *greet* takes one argument *name*. The function prints a greeting, then returns the value null - a null return is optional and is the default if there is no return statement. 
```
func greet(name) {
    say("Hello \(name)")
    return null
}
```

### Invoking
To call a function, place a pair of () after the name of the function and the **arguments** between the parenthesis, comma seperated. You would notice that this is how we are using the *say* and *ask* for input and output, and this is because they are functions themselves.
```
out = greet("John")  # out is null
greet("Ellie")       # or you can ignore the return value
```

### Type Functions
Functions can be attached to a type. This allows the use of dot notation that makes the invoking clearer to the programmer. The syntax of type functions are similar to regular functions:
```
impl add(self, other) for Num {
    return self + other
}

out = 3.add(4)  # out is 7
```

They can also be invoked using the type, note that this will not pass the target as the first parameter:
```
out = Num.add(5, 6)  # out is 11
```

### Challenges
1. Write a function that like the *greet* function that also incorporates the time of day: "Good Morning Alice!", the time of day can be an argument.
2. Write a type function like the *add* function but for multiplication.
3. Experiment with passing too many arguments, what about if you pass too little arguments?
