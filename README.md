# MetaCoffee

MetaCoffee is a top-down compiler-compiler language written in CoffeeScript
and itself. It is a rewrite and redesign of the original Alex Warth's
[OMetaJS](https://github.com/alexwarth/ometa-js).

## What is it good for?

MetaCoffee is a parser that works over a stream of **anything**. 
Thanks to do this, you can not only parse text but also parse
data structures like trees and graphs.

## Some examples please!

For the pattern matching part, MetaCoffee combines OMetaJS syntax
with PEG.js syntax, taking the best from both. The semantic actions
are written in normal CoffeeScript, which is awesome on its own.
Together with a pinch of white-space significance, this
results in a beautiful and simple syntax:

```coffee-script
ometa MultiplicativeInterpreter
  expr     = mulExpr
  mulExpr  = mulExpr:x "*" primExpr:y -> x * y
           | mulExpr:x "/" primExpr:y -> x / y
           | primExpr
  primExpr = "(" expr:x ")"           -> x
           | number
  number   = digit:d                  -> valueOfDigit d

valueOfDigit = (digit) ->
  +digit

console.log MultiplicativeInterpreter.matchAll '(7 * 12) / (8 / 4))', 'expr' 
# 42
```
    
Yes, as in OMetaJS, MetaCoffee allows for parsers to be included anywhere in
CoffeeScript. The second great thing about MetaCoffee is that it's
**object-oriented**! The syntax is familiar:

```coffee-script
ometa ArithmeticInterpreter extends MultiplicativeInterpreter
  expr     = addExpr
  addExpr  = addExpr:x "+" mulExpr:y  -> x + y
           | addExpr:x "-" mulExpr:y  -> x - y
           | mulExpr
  mulExpr  = mulExpr:x "%" primExpr:y -> x % y
           | ^mulExpr
           
console.log ArithmeticInterpreter.matchAll '(9 + 8) / (7 % 6))', 'expr'           
# 17
```

You can spot implicit overriding ( *expr* ), implicit inheritance ( *primExpr* )
and explicit super call ( *^mulExpr* ). But inheritence is the evil sister
to **composition**:

```coffee-script
ometa FruitEvaluator extends ArithmeticInterpreter
  number = FruitParser.fruit
         | ^number
  
ometa FruitParser
  fruit    = "apple" -> 14
           | ("pear" | "peach") -> 93
           | "coconut" -> 1
           
console.log FruitEvaluator.matchAll '2 * apple + 3 * pear', 'expr'
# Yes we can add apples and pears!
# 307
```
