(function() {
  var BSCoffeeScriptCompiler, BSDentParser, BSOMetaParser, BSOMetaTranslator, OMeta, compileCoffeeScript, subclass, _ref;

  OMeta = require('./ometa-base');

  subclass = require('./ometa-lib').subclass;

  BSCoffeeScriptCompiler = require('coffee-script');

  BSDentParser = require('./bs-dentparser');

  _ref = require('./bs-ometa-compiler'), BSOMetaParser = _ref.BSOMetaParser, BSOMetaTranslator = _ref.BSOMetaTranslator;

  BSMetaCoffeeParser = subclass(BSDentParser, {
    "ometa": function() {
      var first, ss, g;
      return (function() {
        first = this._apply("anything");
        at = this._idxConsumedBy((function() {
          return (function() {
            this._or((function() {
              return this._pred(first)
            }), (function() {
              return (function() {
                switch (this._apply('anything')) {
                  case "\n":
                    return "\n";
                  default:
                    throw this.fail
                }
              }).call(this)
            }));
            ss = this._many((function() {
              return this._apply("inspace")
            }));
            this._applyWithArgs("prepend", ss);
            return g = this._applyWithArgs("foreign", BSOMetaParser, 'grammar')
          }).call(this)
        }));
        return ['OMeta', ss.join(''), g]
      }).call(this)
    },
    "coffee": function() {
      var x, xs;
      return (function() {
        at = this._idxConsumedBy((function() {
          return (function() {
            x = this._apply("anything");
            return xs = this._many((function() {
              return (function() {
                this._not((function() {
                  return this._applyWithArgs("ometa", false)
                }));
                return this._apply("anything")
              }).call(this)
            }))
          }).call(this)
        }));
        return ['CoffeeScript', x + xs.join('')]
      }).call(this)
    },
    "topLevel": function() {
      var x, xs;
      return this._or((function() {
        return (function() {
          at = this._idxConsumedBy((function() {
            return (function() {
              x = this._or((function() {
                return (function() {
                  this._many((function() {
                    return this._apply("blankLine")
                  }));
                  return this._applyWithArgs("ometa", true)
                }).call(this)
              }), (function() {
                return this._apply("coffee")
              }));
              return xs = this._many((function() {
                return this._or((function() {
                  return this._applyWithArgs("ometa", false)
                }), (function() {
                  return this._apply("coffee")
                }))
              }))
            }).call(this)
          }));
          return [x].concat(xs)
        }).call(this)
      }), (function() {
        return (function() {
          at = this._idxConsumedBy((function() {
            return this._apply("end")
          }));
          return [['CoffeeScript', '']]
        }).call(this)
      }))
    }
  });;

  compileCoffeeScript = function(source, bare) {
    var result;
    try {
      result = BSCoffeeScriptCompiler.compile(source, {
        bare: bare
      });
    } catch (e) {
      console.log("CoffeeScript SyntaxError in\n\n" + source);
      throw e;
    }
    return result;
  };

  BSMetaCoffeeTranslator = subclass(OMeta, {
    "trans": function() {
      var bare, t, ans, xs;
      return (function() {
        bare = this._apply("anything");
        at = this._idxConsumedBy((function() {
          return xs = this._many((function() {
            return (function() {
              at = this._idxConsumedBy((function() {
                return this._form((function() {
                  return (function() {
                    t = this._apply("anything");
                    return ans = this._applyWithArgs("apply", t)
                  }).call(this)
                }))
              }));
              return ans
            }).call(this)
          }))
        }));
        return compileCoffeeScript(xs.join(''), bare)
      }).call(this)
    },
    "CoffeeScript": function() {
      return this._apply("anything")
    },
    "OMeta": function() {
      var ss, t, js;
      return (function() {
        at = this._idxConsumedBy((function() {
          return (function() {
            ss = this._apply("anything");
            t = this._apply("anything");
            return js = this._applyWithArgs("foreign", BSOMetaTranslator, 'trans', t)
          }).call(this)
        }));
        return "\n" + ss + "\`" + js + "\`\n"
      }).call(this)
    }
  });;

  module.exports = {
    BSMetaCoffeeParser: BSMetaCoffeeParser,
    BSMetaCoffeeTranslator: BSMetaCoffeeTranslator
  };

}).call(this);