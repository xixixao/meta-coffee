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
           | "coconut"          -> 1
           
console.log FruitEvaluator.matchAll '2 * apple + 3 * pear', 'expr'
# Yes we can add apples and pears!
# 307
```

## Syntax
Grammar consists of a list of rules, that are indented the same number of spaces more than the keyword **ometa**. Each rule has a unique name followed by optional parameters, equal sign and the body of the rule. These must come either after the rule name, or on next lines given they are more indented than the rule name. The parameters behave in the same way tokens do, and for now are really just a syntactic sugar - it doesn't matter whether they precede the equal sign or not.

Anything following the equal sign or indented at least as much as the equal sign is part of the rule's body. The rule's body consist of a single parsing **expression**.

### Expressions (simple)

There are several types of expressions, very similar to PEG.js. The basic ones are, from the loosest binding to the ones with highest precedence:

```coffee-script
expression1 | expression2 | ... | expressionN
```
&nbsp;&nbsp;&nbsp;&nbsp;Tries to match the first expression, if it fails, tries the second one and so on. Returns the first successfully matched expressions's result. This behavior distinguishes parser expressions grammars, like MetaCoffee, from other types of grammars!

```coffee-script
expression -> semanticAction
```
&nbsp;&nbsp;&nbsp;&nbsp;When the expressions matches, the semantic action is executed, and since it is the rightmost part of an expression, its return value becomes the match result of the whole expression. Semantic actions are written in CoffeeScript, they behave like function bodies and if they consist of more than one line, the following lines must be more indented than the "tip" of the arrow (->).

```coffee-script
expression1 expression2 ... expressionN
```
&nbsp;&nbsp;&nbsp;&nbsp;Matches expression after expression, returning the **last** expression's match result.

```coffee-script
rule
```
&nbsp;&nbsp;&nbsp;&nbsp;Returns the result of recursively applying the given rule.

### Naming
To be able to manipulate the match results of all subexpressions in given expressions, we label them with identifiers (these must be valid CoffeeScript variable identifiers). 

```coffee-script
expression:name
```
The match results are assigned to these identifiers and can be used anywhere inside the rule body (in semantic actions and as arguments to other rules).

### Expressions - quantified
We can more succinctly express the number of occurences of expression, similar to regular expressions:
```coffee-script
expression*
```
Matches as many occurences of expression as possible and returns an **array** of match results.

```coffee-script
expression+
```
Matches **one** or more occurences of expression and returns an **array** of match results.

```coffee-script
expression?
```
Always succeeds, matches expression and returns its result or returns undefined.

### Predicates
Sometimes we want to determine the behavior of our parser depending on the following input. MetaCoffee provides infinite positive or negative lookahead.
```coffee-script
&expression
```
Succeeds when the expression would match next, but doesn't consume the matched input.
```coffee-script
!expression
```
The opposite of positive lookahead, succeeds when the expression would fail next.
```coffee-script
&{semanticAction}
```
Runs the semantic action and succeeds if the semantic action returns **true** value. 
```coffee-script
!{semanticAction}
```
Runs the semantic action and succeeds if the semantic action returns **false** value.

### Semantic Actions
Semantic actions can be included anywhere as a subexpression without the need for matching or a return value like this:
```coffee-script
{semanticAction}
```
This is extremely handy, for example, we can log our progress when running our grammar. If the action does return a value, we can label it and use as any other expression. Unlike the semantic actions following arrow, these are not indented to a certail column, so if they take up more than one line, it is advisable to start on the second line.

```coffee-script
# With arrow
expression:e -> result = scramble e
                console.log result
# Inside curly braces
expression:e {  
  console.log e
  scramble e
}:scr expression2 -> scr
```
The indentation rules in MetaCoffee might seem convulted, but in reality they simple match the desired behavior.

### Arguments and Foreign Rule Application
```coffee-script
rule(semanticAction1, semanticAction2, ..., semanticActionN)
```
Applies the rule, passing in the results of semantic actions (this can be a simple identifier). Care must be taken when using function calls inside the actions, as CoffeeScript by default takes as argument anything until the end of line (in this case, until the right parenthesis). At the moment, this prepends the arguments at the beginning of the input stream for the rule to match them.

```coffee-script
Class.rule(semanticAction1, semanticAction2, ..., semanticActionN)
```
Invokes the rule on the Class, which must be a MetaCoffee grammar.

## Built-in Rules
MetaCoffee comes with a large variety of useful built-in rules.

```coffee-script
anything
:label
```
The most basic matching rule, succeeds if there is at least one element to be matched in the input and returns it. Anything is also the default when we don't specify the rule to be a applied to get the result for a label.
```coffee-script
end # defined as !anything
```
Matches the end of the input. Can be applied arbitrary number of times.
```coffee-script
pos
```
Useful when parsing a linear structure (for example a string), returns the current position in the input from the beginning.
```coffee-script
empty
```
Always matches.

```coffee-script
true
false
undefined
```
Matches if the next thing in input is literal true/false/undefined (compares with JavaScript ===).

```coffee-script
number
string
```
Matches if the next thing in input is a literal number/string (typeof "number"/"string") and returns it.

```coffee-script
char
```
Matches if the next thing in input is a string of length 1 (a character) and returns it.

```coffee-script
space
spaces # defined as space*
```
Matches a char/s with char code <= 32. This rule can be overriden to exclude or include other things as whitespace.

```coffee-script
digit
lower
upper
letter # defined as lower | upper
letterOrDigit # defined as letter | digit
```
Match one char and check its char code. Lower, upper and letter are only defined on the basic ASCII Latin alphabet.

### Built-in Parametrized Rules
These methods have actual function arguments. When calling them from our grammar, MetaCoffee takes care of using the arguments and not the input stream to pass them in.

```coffee-script
apply('ruleName')
```
Meta rule for MetaCoffee!! Applies a rule of this grammar with given name. This means, one can apply rules dynamicly based on the input!
```coffee-script
foreign(Class, 'ruleName')
```
Combination of apply and foreign rule invocation.
```coffee-script
exactly(what)
```
Compares the next thing in the input with the passed-in argument.
```coffee-script
firstAndRest(first, rest)
seq(what)
notLast(what)
listOf(what, delimeter)
token(string)
fromTo(left, right)
```