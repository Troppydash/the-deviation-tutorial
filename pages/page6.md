```
Str.type() == Type  # true
```

# Types and Conversion

Unlike its host language Javascript, Devia have a data type dedicated to Types, each representing another data type. The list of them are also mentioned in the Data Types section:
- Num represents numbers
- Str represents strings
- Bool represents booleans
- Null represent null
- Type represents all these types: Str, Num, and so on

### Usages
These types behave similar to regular data types, so logical operators work just fine:
```
Str == Str   # true
Num == Bool  # false
# assigning them to variables works
someType = Str
```

Here is how to check the type of a value or variable:
```
"Hello".type() == Str  # true
"Hello".is(Str)        # true
```

### Conversions
There are multiple ways to convert data types from one to another for sake of consistency, I recommend sticking to a consistent way.

```
a = Str(12.3)
b = Num("567")
# or
a = (12.3).str()
b = "567".num()
```
If the conversion were to fail - like **casting** "Hello" to a number, the result is always null.

### Challenges
1. Now that you can convert user input to other types, write a program that ask someone their age, and tell them how old they are in 18 years.
2. Mess around with converting types, see if you can predict the outcome.






