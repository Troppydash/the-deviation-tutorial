```
1 + 1  # = 2
```

# Operators

Operators are used to perform operations on variables and values, you should be familiar with them from your mathematics class.

### Nitty Gritty Details
Infix operators have two **operands**; Prefix operators have one **operand**. The operands can be values or variables, or even other operator expressions so chaining operators is possible.

### Operational Operators
There are four common infix operational operators in Devia, they do exactly what your maths teacher said:
```
a + b  # Addition
a - b  # Subtraction
a * b  # Multiplication
a / b  # Decimal division
```

There are two prefix operators:
```
+a  # Positive 
-a  # Negative
```

All of the operational operators have a special property - they always **evaluate** to the type of the left operand.
```
"Hello" + "World"  # the result is Str
```

### Logical Operators
These logical operators always evaluates to a boolean. Here are all of them:
```
a > b
a >= b
a < b
a <= b
a == b
a /= b

a and b
a or b
not a
```

### Examples
These are some examples of the uses of operators combined with variables:
```
message = "Hello" + " " + "World"
favnum = 2 * (12 + 5)
result = 3 + 2 > 1 + 4
isRaining? = true and true
isLarger? = favnum > 10
```
You can also use them in a **say** function, without putting it in a variable first:
```
say(1 + 2)
say("Hello" + "World" + "!")
```

### Challenges
1. Write a program that ask for the user's firstname, middlename, and lastname. Then greet them in their full name.
2. Try around with these operations on different data types. What are the reasons for those error messages?
3. Complete the template program in the editor, make it compute the quadratic equation $$(-b +- sqrt(b^2-4ac))/2a$$ 



