define([
  './ometa-base',
  './ometa-lib',
  'coffee-script'
], function (OMeta, OMLib, BSCoffeeScriptCompiler){
subclass = OMLib.subclass;

BSDentParser = OMeta.interpreters.BSDentParser;

BSCSParser=subclass(OMeta,{
"action":function(){var input,args,compiled;return (function(){input=this._apply("anything");args=this._apply("anything");compiled=this._applyWithArgs("compile",input,args);return this._or((function(){return this._applyWithArgs("simplify",compiled)}),(function(){return compiled}))}).call(this)},
"simpleExp":function(){var input,args,compiled;return (function(){input=this._apply("anything");args=this._apply("anything");compiled=this._applyWithArgs("compile",input,args);return this._applyWithArgs("simplify",compiled)}).call(this)},
"compile":function(){var input,args;return (function(){input=this._apply("anything");args=this._apply("anything");return OMLib.trim(BSCoffeeScriptCompiler.compile("((" + args.join() + ") ->\n  " + input.replace(/\n/g, '\n  ') + ").call(this)", {
    bare: true
  })).replace(/^\s*(var[^]*?)?(\(function[^]*?\{)([^]*)/, "(function(){$1$3").replace(/;$/, '')}).call(this)},
"simplify":function(){var compiled;return (function(){compiled=this._apply("anything");return (function (){var lines=compiled.split("\n");if(((lines["length"] < (2)) || (! lines[(1)].match(/^ +return/)))){throw this["fail"]}else{undefined};(exp=lines.slice((1),(- (1))));(exp[(0)]=exp[(0)].replace(/^ +return /,""));return exp.join("\n").replace(/;$/,"")}).call(this)}).call(this)}});;
BSSemActionParser=subclass(BSDentParser,{
"initialize":function(){return (function(){(function (){(this["dentlevel"]=(0));return (this["sep"]="none")}).call(this);return BSDentParser._superApplyWithArgs(this,'initialize')}).call(this)},
"none":function(){return this._not((function(){return this._apply("empty")}))},
"comma":function(){return this._applyWithArgs("exactly",",")},
"between":function(){var s,e,t;return (function(){s=this._apply("anything");e=this._apply("anything");this._applyWithArgs("seq",s);t=this._applyWithArgs("text",true);this._applyWithArgs("seq",e);return t}).call(this)},
"pairOf":function(){var s,e,t;return (function(){s=this._apply("anything");e=this._apply("anything");t=this._applyWithArgs("between",s,e);return ((s + t) + e)}).call(this)},
"delims":function(){return (function(){switch(this._apply('anything')){case "{":return "{";case "(":return "(";case "[":return "[";case "}":return "}";case ")":return ")";case "]":return "]";default: throw this.fail}}).call(this)},
"pair":function(){return this._or((function(){return this._applyWithArgs("pairOf","{","}")}),(function(){return this._applyWithArgs("pairOf","(",")")}),(function(){return this._applyWithArgs("pairOf","[","]")}))},
"text3":function(){var d;return this._or((function(){return (function(){d=this._apply("dent");return this._applyWithArgs("stripdent",d,this["dentlevel"])}).call(this)}),(function(){return (function(){this._not((function(){return this._applyWithArgs("exactly","\n")}));return this._apply("anything")}).call(this)}))},
"fromTo":function(){var s,e;return (function(){s=this._apply("anything");e=this._apply("anything");return this._consumedBy((function(){return (function(){this._applyWithArgs("seq",s);this._many((function(){return this._or((function(){return (function(){switch(this._apply('anything')){case "\\":return this._or((function(){return (function(){switch(this._apply('anything')){case "\\":return "\\\\";default: throw this.fail}}).call(this)}),(function(){return (function(){"\\";return this._applyWithArgs("seq",e)}).call(this)}));default: throw this.fail}}).call(this)}),(function(){return (function(){this._not((function(){return this._applyWithArgs("seq",e)}));return this._apply("char")}).call(this)}))}));return this._applyWithArgs("seq",e)}).call(this)}))}).call(this)},
"text2":function(){var inside;return (function(){inside=this._apply("anything");return this._or((function(){return this._applyWithArgs("fromTo",'###','###')}),(function(){return this._applyWithArgs("fromTo",'"','"')}),(function(){return this._applyWithArgs("fromTo",'\'','\'')}),(function(){return (function(){switch(this._apply('anything')){case "/":return (function(){this._many1((function(){return (function(){this._not((function(){return this._applyWithArgs("exactly",'\n')}));return this._apply("anything")}).call(this)}));return this._applyWithArgs("exactly","/")}).call(this);default: throw this.fail}}).call(this)}),(function(){return (function(){this._pred(inside);this._not((function(){return this._apply("delims")}));return this._apply("text3")}).call(this)}),(function(){return (function(){this._not((function(){return this._applyWithArgs("exactly",'\n')}));this._not((function(){return this._apply("delims")}));this._not((function(){return this._applyWithArgs("apply",this.sep)}));return this._apply("anything")}).call(this)}),(function(){return this._apply("pair")}))}).call(this)},
"text":function(){var inside,ts;return (function(){inside=this._apply("anything");ts=this._many((function(){return this._applyWithArgs("text2",inside)}));return ts.join("")}).call(this)},
"line":function(){return this._applyWithArgs("text",false)},
"nextLine":function(){var p,d,l;return (function(){p=this._apply("anything");d=this._applyWithArgs("moredent",p);l=this._apply("line");return (d + l)}).call(this)},
"exp":function(){var p,fl,ls;return (function(){p=this._apply("anything");fl=this._apply("line");ls=this._many((function(){return this._applyWithArgs("nextLine",p)}));return (fl + ls.join(""))}).call(this)},
"simpleExp":function(){var args,t;return (function(){args=this._apply("anything");this._apply("spaces");(this["sep"]="comma");t=this._applyWithArgs("text",false);return this._applyWithArgs("foreign",BSCSParser,'simpleExp',t,args)}).call(this)},
"delimSemAction":function(){var args,e;return (function(){args=this._apply("anything");this._apply("spaces");e=this._applyWithArgs("between","{","}");return this._applyWithArgs("foreign",BSCSParser,'action',e,args)}).call(this)},
"semAction":function(){var p,args,e;return (function(){p=this._apply("anything");args=this._apply("anything");(this["dentlevel"]=p);return this._or((function(){return this._apply("delimSemAction")}),(function(){return (function(){e=this._applyWithArgs("exp",p);return this._applyWithArgs("foreign",BSCSParser,'action',e,args)}).call(this)}))}).call(this)}});;

  api = {
    BSSemActionParser: BSSemActionParser
  }
  OMLib.extend(OMeta.interpreters, api);
  return api;
});