```

```

# Javascript Interpolating
Devia is nowhere close to being complete or stable - there are often unimplemented features in the programming language and undesirable bugs. The name Deviation means closeness, closeness to another stable programming language is what Devia wants. So it allows usages of Javascript inside regular Devia programs.

To execute a Javascript segment:
```
javascript """
// we are in Javascript now
console.log("Hello World");
"""
```

You can also pass variables in and out of Javascript:
```
a = 12

javascript """
// imports the variable `a`
const a = de.import("a");
a;  // 12

// exports the value `a * 2`
de.export("b", a * 2);
"""

b  # 24
```

### Performance
For performance reasons, it is sometimes better to write a complex function in Javascript rather than in Devia. Here is the example from the github repo *readme.md*:
```
#!/run
# using javascript inside of devia
values = list(1, 10, 20, 30)

javascript """
    function factorial(n) {
        if (n < 2) {
            return 1;
        }
        return n * factorial(n-1);
    }
    
    // import the variable "values" from devia
    const values = de.import("values");
    
    // calculate factorials
    const out = [];
    for (const value of values) {
        out.push(factorial(value));
    }
    // export the variable as "out" to devia
    de.export("out", out);
"""

each item, index of out {
    say("factorial", values.get(index), "=", item)
}
```


### Challenges
1. Javascript is a powerful language of its own, so much so that Devia is written entirely in it. What language is Google's Javascript V8 engine written in?
2. Does importing/exporting functions into Javascript work as intended?
