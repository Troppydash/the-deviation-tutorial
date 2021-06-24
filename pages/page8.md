```
# FizzBuzz Template
# a.mod(b) gets the remainder of 5 / 2
# "Hello".have("lo") returns true if the string "Hello"
# have the string "lo" inside

i = 1
loop 100 {
    # start here
    i = i + 1
}

```

# Control Flow & Loops
A program that does the same thing everytime it runs is not very entertaining - video games that plays by itself is no fun. This is achieved with conditional jump statements in machine language, but modern programming languages like Devia have more human friendly syntaxes.

### If statements
*If-elif-else* statements executes different statements depending on the **condition**. Here is an example - the message *neither is true* is printed:
```
if 1 > 2 {
    say("1>2 is true")
} elif 2 > 3 {
    say("2>3 is true")
} else {
    say("neither is true")
}
```

A boolean value is needed as the condition for *if* statements: logical statements, variables, or expressions that return a boolean are all accepted. You can also leave out parts of the syntax, like so:
```
if true {
    say("true")
}

good = true
if good {
    say("it is good")
} else {
    say("it is not good")
}
```

### Match statements
Match statements are syntax sugar for long *if-elif* statements. The condition in the *match* statement is matched against all the *case* statements, and when matched, the branch will execute. The default case, if exists, will run when no other case matches.

```
weekday = 1
match weekday {
    case 1 {
        say("Monday")
    }
    case 2 {
        say("Tuesday")
    }
    case 3 {
        say("Wednesday")
    }
    case 4 {
        say("Thursday")
    }
    case 5 {
        say("Friday")
    }
    default {
        say("Weekends")
    }
}
```

If there are no conditions in a match statement, the first case branch that evaluates to true is ran instead.
```
match {
    case 1 > 2 {
    }
    case false {
    }
    default {
    }
}
```

### Loops
A lot of loops exist in Devia, each with their own benefits. Here is a list of them and their functions:
```
# loop statements 20 times
loop 20 {}

# loop forever
loop {}

# run until not i > 12
while i > 12 {}

# also loop forever
while true {}
```

Two more advance loops are also available:
```
# Syntax: for <initial>; <condition>; <after> {}
for a = 0; a < 10; a++ {}

# Syntax: each <value>, <key> of <iterator> {}
each value, key of range(10) {}
```
*The range function is explained later*

### Continue & Break
Two statements allow you to control the surrounding loop. Continue discards the rest of the current loop; Break jumps out of the loop entirely.

```
loop {
    input = ask()
    if input == "bye" {
        # jumps out of the infinite loop
        break
    }
    say(input)
}

each a of range(12) {
    if a < 6 {
        # skips the rest of this iteration
        # so skips the say(a) function if a < 6
        continue
    }
    say(a)
}
```

### Challenges
1. Make a useless program that asks for an input, then prints that input 100 times.
2. A program that ask someone their grade as a percentage, then print a comment accordingly.
3. The [Newton's Method](https://en.wikipedia.org/wiki/Newton%27s_method) is an optimizing algorithm, make one and use it to find the solution(s) to the equation: $$   -3x^2+5x+3 = 0$$ given an initial guessing value of 2.
4. Write a program that computes the game FizzBuzz: every number divisible by 3 prints Fizz, every number containing 3 prints Buzz, prints FizzBuzz if both, and prints the number if neither. Some useful functions are given already in the editor.
