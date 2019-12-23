(function() {
  var BSDentParser, BSOMetaOptimizer, BSSemActionParser, OMeta, Set, programString, propertyNames, subclass, unescape, _ref;

  OMeta = require('./ometa-base');

  _ref = require('./ometa-lib'), subclass = _ref.subclass, propertyNames = _ref.propertyNames, unescape = _ref.unescape, programString = _ref.programString, Set = _ref.Set;

  BSDentParser = require('./bs-dentparser');

  BSSemActionParser = require('./bs-semactionparser');

  BSOMetaOptimizer = require('./bs-ometa-optimizer');

  BSOMetaParser = subclass(BSDentParser, {
    "lineComment": function() {
      return this._applyWithArgs("fromTo", '# ', '\n')
    },
    "blockComment": function() {
      return this._applyWithArgs("fromTo", '#>', '<#')
    },
    "space": function() {
      return this._or((function() {
        return (function() {
          switch (this._apply('anything')) {
            case " ":
              return " ";
            default:
              throw this.fail
          }
        }).call(this)
      }), (function() {
        return this._apply("spacedent")
      }), (function() {
        return this._apply("lineComment")
      }), (function() {
        return this._apply("blockComment")
      }))
    },
    "blankLine": function() {
      return this._or((function() {
        return (function() {
          this._many((function() {
            return this._applyWithArgs("exactly", " ")
          }));
          return this._or((function() {
            return this._apply("lineComment")
          }), (function() {
            return (function() {
              this._apply("blockComment");
              this._many((function() {
                return this._applyWithArgs("exactly", " ")
              }));
              return this._applyWithArgs("exactly", "\n")
            }).call(this)
          }))
        }).call(this)
      }), (function() {
        return BSDentParser._superApplyWithArgs(this, 'blankLine')
      }))
    },
    "nameFirst": function() {
      return this._or((function() {
        return (function() {
          switch (this._apply('anything')) {
            case "_":
              return "_";
            case "$":
              return "$";
            default:
              throw this.fail
          }
        }).call(this)
      }), (function() {
        return this._apply("letter")
      }))
    },
    "bareName": function() {
      return this._consumedBy((function() {
        return (function() {
          this._apply("nameFirst");
          return this._many((function() {
            return this._or((function() {
              return this._apply("nameFirst")
            }), (function() {
              return this._apply("digit")
            }))
          }))
        }).call(this)
      }))
    },
    "name": function() {
      return (function() {
        this._apply("spaces");
        return this._apply("bareName")
      }).call(this)
    },
    "hexValue": function() {
      var ch;
      return (function() {
        at = this._idxConsumedBy((function() {
          return ch = this._apply("anything")
        }));
        return '0123456789abcdef'.indexOf(ch.toLowerCase())
      }).call(this)
    },
    "hexDigit": function() {
      var x, v;
      return (function() {
        at = this._idxConsumedBy((function() {
          return (function() {
            x = this._apply("char");
            v = this._applyWithArgs("hexValue", x);
            return this._pred(v >= 0)
          }).call(this)
        }));
        return v
      }).call(this)
    },
    "escapedChar": function() {
      var s;
      return this._or((function() {
        return (function() {
          at = this._idxConsumedBy((function() {
            return s = this._consumedBy((function() {
              return (function() {
                this._applyWithArgs("exactly", "\\");
                return this._or((function() {
                  return (function() {
                    switch (this._apply('anything')) {
                      case "u":
                        return (function() {
                          this._apply("hexDigit");
                          this._apply("hexDigit");
                          this._apply("hexDigit");
                          return this._apply("hexDigit")
                        }).call(this);
                      case "x":
                        return (function() {
                          this._apply("hexDigit");
                          return this._apply("hexDigit")
                        }).call(this);
                      default:
                        throw this.fail
                    }
                  }).call(this)
                }), (function() {
                  return this._apply("char")
                }))
              }).call(this)
            }))
          }));
          return unescape(s)
        }).call(this)
      }), (function() {
        return this._apply("char")
      }))
    },
    "charSequence": function() {
      var xs;
      return (function() {
        at = this._idxConsumedBy((function() {
          return (function() {
            this._applyWithArgs("exactly", "\"");
            xs = this._many((function() {
              return (function() {
                this._not((function() {
                  return this._applyWithArgs("exactly", "\"")
                }));
                return this._apply("escapedChar")
              }).call(this)
            }));
            return this._applyWithArgs("exactly", "\"")
          }).call(this)
        }));
        return ['App', 'token', programString(xs.join(''))]
      }).call(this)
    },
    "string": function() {
      var xs;
      return (function() {
        at = this._idxConsumedBy((function() {
          return (function() {
            this._applyWithArgs("exactly", "\'");
            xs = this._many((function() {
              return (function() {
                this._not((function() {
                  return this._applyWithArgs("exactly", "\'")
                }));
                return this._apply("escapedChar")
              }).call(this)
            }));
            return this._applyWithArgs("exactly", "\'")
          }).call(this)
        }));
        return ['App', 'exactly', programString(xs.join(''))]
      }).call(this)
    },
    "number": function() {
      var n;
      return (function() {
        at = this._idxConsumedBy((function() {
          return n = this._consumedBy((function() {
            return (function() {
              this._opt((function() {
                return this._applyWithArgs("exactly", "-")
              }));
              return this._many1((function() {
                return this._apply("digit")
              }))
            }).call(this)
          }))
        }));
        return ['App', 'exactly', n]
      }).call(this)
    },
    "keyword": function() {
      var xs;
      return (function() {
        xs = this._apply("anything");
        at = this._idxConsumedBy((function() {
          return (function() {
            this._applyWithArgs("token", xs);
            return this._not((function() {
              return this._apply("letterOrDigit")
            }))
          }).call(this)
        }));
        return xs
      }).call(this)
    },
    "args": function() {
      var xs;
      return this._or((function() {
        return (function() {
          at = this._idxConsumedBy((function() {
            return (function() {
              this._applyWithArgs("exactly", "(");
              xs = this._applyWithArgs("listOf", 'hostExpr', ',');
              return this._applyWithArgs("token", ")")
            }).call(this)
          }));
          return xs
        }).call(this)
      }), (function() {
        return (function() {
          at = this._idxConsumedBy((function() {
            return this._apply("empty")
          }));
          return []
        }).call(this)
      }))
    },
    "application": function() {
      var rule, as, grm;
      return this._or((function() {
        return (function() {
          at = this._idxConsumedBy((function() {
            return (function() {
              this._applyWithArgs("token", "^");
              rule = this._apply("name");
              return as = this._apply("args")
            }).call(this)
          }));
          return ['App', "super", "'" + rule + "'"].concat(as)
        }).call(this)
      }), (function() {
        return (function() {
          at = this._idxConsumedBy((function() {
            return (function() {
              grm = this._apply("name");
              this._applyWithArgs("token", ".");
              rule = this._apply("name");
              return as = this._apply("args")
            }).call(this)
          }));
          return ['App', "foreign", grm, "'" + rule + "'"].concat(as)
        }).call(this)
      }), (function() {
        return (function() {
          at = this._idxConsumedBy((function() {
            return (function() {
              rule = this._apply("name");
              return as = this._apply("args")
            }).call(this)
          }));
          return ['App', rule].concat(as)
        }).call(this)
      }))
    },
    "hostExpr": function() {
      return this._applyWithArgs("foreign", BSSemActionParser, 'simpleExp', this.locals.values())
    },
    "closedHostExpr": function() {
      return this._applyWithArgs("foreign", BSSemActionParser, 'delimSemAction', this.locals.values())
    },
    "openHostExpr": function() {
      var p;
      return (function() {
        p = this._apply("anything");
        return this._applyWithArgs("foreign", BSSemActionParser, 'semAction', p, this.locals.values())
      }).call(this)
    },
    "semAction": function() {
      var x;
      return (function() {
        at = this._idxConsumedBy((function() {
          return x = this._apply("closedHostExpr")
        }));
        return ['Act', x]
      }).call(this)
    },
    "arrSemAction": function() {
      var p, x;
      return (function() {
        at = this._idxConsumedBy((function() {
          return (function() {
            this._applyWithArgs("token", "->");
            p = this._apply("linePos");
            return x = this._applyWithArgs("openHostExpr", p)
          }).call(this)
        }));
        return ['Act', x]
      }).call(this)
    },
    "semPred": function() {
      var x;
      return this._or((function() {
        return (function() {
          at = this._idxConsumedBy((function() {
            return (function() {
              this._applyWithArgs("token", "&");
              return x = this._apply("closedHostExpr")
            }).call(this)
          }));
          return ['Pred', x]
        }).call(this)
      }), (function() {
        return (function() {
          at = this._idxConsumedBy((function() {
            return (function() {
              this._applyWithArgs("token", "!");
              return x = this._apply("closedHostExpr")
            }).call(this)
          }));
          return ['Not', ['Pred', x]]
        }).call(this)
      }))
    },
    "expr": function() {
      var p, x;
      return (function() {
        p = this._apply("anything");
        at = this._idxConsumedBy((function() {
          return (function() {
            this._applyWithArgs("setdent", p);
            x = this._apply("expr5");
            return this.redent()
          }).call(this)
        }));
        return x
      }).call(this)
    },
    "expr5": function() {
      var x, xs;
      return this._or((function() {
        return (function() {
          at = this._idxConsumedBy((function() {
            return (function() {
              x = this._applyWithArgs("expr4", true);
              return xs = this._many1((function() {
                return (function() {
                  this._applyWithArgs("token", "|");
                  return this._applyWithArgs("expr4", true)
                }).call(this)
              }))
            }).call(this)
          }));
          return ['Or', x].concat(xs)
        }).call(this)
      }), (function() {
        return (function() {
          at = this._idxConsumedBy((function() {
            return (function() {
              x = this._applyWithArgs("expr4", true);
              return xs = this._many1((function() {
                return (function() {
                  this._applyWithArgs("token", "||");
                  return this._applyWithArgs("expr4", true)
                }).call(this)
              }))
            }).call(this)
          }));
          return ['XOr', x].concat(xs)
        }).call(this)
      }), (function() {
        return this._applyWithArgs("expr4", false)
      }))
    },
    "expr4": function() {
      var ne, xs, act;
      return (function() {
        ne = this._apply("anything");
        return this._or((function() {
          return (function() {
            at = this._idxConsumedBy((function() {
              return (function() {
                xs = this._many((function() {
                  return this._apply("expr3")
                }));
                return act = this._apply("arrSemAction")
              }).call(this)
            }));
            return ['And', ['Set', 'at', ['IdxConsBy', ['And'].concat(xs)]], act]
          }).call(this)
        }), (function() {
          return (function() {
            at = this._idxConsumedBy((function() {
              return (function() {
                this._pred(ne);
                return xs = this._many1((function() {
                  return this._apply("expr3")
                }))
              }).call(this)
            }));
            return ['And'].concat(xs)
          }).call(this)
        }), (function() {
          return (function() {
            at = this._idxConsumedBy((function() {
              return (function() {
                this._not((function() {
                  return this._pred(ne)
                }));
                return xs = this._many((function() {
                  return this._apply("expr3")
                }))
              }).call(this)
            }));
            return ['And'].concat(xs)
          }).call(this)
        }))
      }).call(this)
    },
    "optIter": function() {
      var x;
      return (function() {
        x = this._apply("anything");
        return this._or((function() {
          return (function() {
            at = this._idxConsumedBy((function() {
              return this._applyWithArgs("exactly", "*")
            }));
            return ['Many', x]
          }).call(this)
        }), (function() {
          return (function() {
            at = this._idxConsumedBy((function() {
              return this._applyWithArgs("exactly", "+")
            }));
            return ['Many1', x]
          }).call(this)
        }), (function() {
          return (function() {
            at = this._idxConsumedBy((function() {
              return this._applyWithArgs("exactly", "?")
            }));
            return ['Opt', x]
          }).call(this)
        }), (function() {
          return (function() {
            at = this._idxConsumedBy((function() {
              return this._apply("empty")
            }));
            return x
          }).call(this)
        }))
      }).call(this)
    },
    "optBind": function() {
      var x, n;
      return (function() {
        x = this._apply("anything");
        return this._or((function() {
          return (function() {
            at = this._idxConsumedBy((function() {
              return (function() {
                this._applyWithArgs("exactly", ":");
                return n = this._apply("name")
              }).call(this)
            }));
            return (function() {
              this.locals.add(n);
              return ['Set', n, x];
            }).call(this)
          }).call(this)
        }), (function() {
          return (function() {
            at = this._idxConsumedBy((function() {
              return this._apply("empty")
            }));
            return x
          }).call(this)
        }))
      }).call(this)
    },
    "expr3": function() {
      var n, x, e;
      return this._or((function() {
        return (function() {
          at = this._idxConsumedBy((function() {
            return (function() {
              this._applyWithArgs("token", ":");
              return n = this._apply("name")
            }).call(this)
          }));
          return (function() {
            this.locals.add(n);
            return ['Set', n, ['App', 'anything']];
          }).call(this)
        }).call(this)
      }), (function() {
        return (function() {
          e = this._or((function() {
            return (function() {
              x = this._apply("expr2");
              return this._applyWithArgs("optIter", x)
            }).call(this)
          }), (function() {
            return this._apply("semAction")
          }));
          return this._applyWithArgs("optBind", e)
        }).call(this)
      }), (function() {
        return this._apply("semPred")
      }))
    },
    "expr2": function() {
      var x;
      return this._or((function() {
        return (function() {
          at = this._idxConsumedBy((function() {
            return (function() {
              this._applyWithArgs("token", "!");
              return x = this._apply("expr2")
            }).call(this)
          }));
          return ['Not', x]
        }).call(this)
      }), (function() {
        return (function() {
          at = this._idxConsumedBy((function() {
            return (function() {
              this._applyWithArgs("token", "&");
              return x = this._apply("expr1")
            }).call(this)
          }));
          return ['Lookahead', x]
        }).call(this)
      }), (function() {
        return this._apply("expr1")
      }))
    },
    "expr1": function() {
      var x;
      return this._or((function() {
        return this._apply("application")
      }), (function() {
        return (function() {
          at = this._idxConsumedBy((function() {
            return x = this._or((function() {
              return this._applyWithArgs("keyword", 'undefined')
            }), (function() {
              return this._applyWithArgs("keyword", 'nil')
            }), (function() {
              return this._applyWithArgs("keyword", 'true')
            }), (function() {
              return this._applyWithArgs("keyword", 'false')
            }))
          }));
          return ['App', 'exactly', x]
        }).call(this)
      }), (function() {
        return (function() {
          this._apply("spaces");
          return this._or((function() {
            return this._apply("charSequence")
          }), (function() {
            return this._apply("string")
          }), (function() {
            return this._apply("number")
          }))
        }).call(this)
      }), (function() {
        return (function() {
          at = this._idxConsumedBy((function() {
            return (function() {
              this._applyWithArgs("token", "[");
              x = this._applyWithArgs("expr", 0);
              return this._applyWithArgs("token", "]")
            }).call(this)
          }));
          return ['Form', x]
        }).call(this)
      }), (function() {
        return (function() {
          at = this._idxConsumedBy((function() {
            return (function() {
              this._applyWithArgs("token", "<");
              x = this._applyWithArgs("expr", 0);
              return this._applyWithArgs("token", ">")
            }).call(this)
          }));
          return ['ConsBy', x]
        }).call(this)
      }), (function() {
        return (function() {
          at = this._idxConsumedBy((function() {
            return (function() {
              this._applyWithArgs("token", "@<");
              x = this._applyWithArgs("expr", 0);
              return this._applyWithArgs("token", ">")
            }).call(this)
          }));
          return ['IdxConsBy', x]
        }).call(this)
      }), (function() {
        return (function() {
          at = this._idxConsumedBy((function() {
            return (function() {
              this._applyWithArgs("token", "(");
              x = this._applyWithArgs("expr", 0);
              return this._applyWithArgs("token", ")")
            }).call(this)
          }));
          return x
        }).call(this)
      }))
    },
    "ruleName": function() {
      return this._apply("bareName")
    },
    "rule": function() {
      var n, p, x, xs;
      return (function() {
        at = this._idxConsumedBy((function() {
          return (function() {
            this._lookahead((function() {
              return n = this._apply("ruleName")
            }));
            this.locals = new Set;
            p = this._apply("linePos");
            this._applyWithArgs("setdent", p + 1);
            x = this._applyWithArgs("rulePart", n);
            xs = this._many((function() {
              return (function() {
                this._applyWithArgs("nodent", p);
                return this._applyWithArgs("rulePart", n)
              }).call(this)
            }));
            return this.redent()
          }).call(this)
        }));
        return ['Rule', n, this.locals.values(), ['Or', x].concat(xs)]
      }).call(this)
    },
    "rulePart": function() {
      var rn, n, b1, p, b2;
      return (function() {
        rn = this._apply("anything");
        n = this._apply("ruleName");
        this._pred(n === rn);
        b1 = this._applyWithArgs("expr4", false);
        return this._or((function() {
          return (function() {
            at = this._idxConsumedBy((function() {
              return (function() {
                this._apply("spaces");
                p = this._apply("linePos");
                this._applyWithArgs("exactly", "=");
                return b2 = this._applyWithArgs("expr", p)
              }).call(this)
            }));
            return ['And', b1, b2]
          }).call(this)
        }), (function() {
          return (function() {
            at = this._idxConsumedBy((function() {
              return this._apply("empty")
            }));
            return b1
          }).call(this)
        }))
      }).call(this)
    },
    "grammar": function() {
      var ss, ip, n, sn, p, r, rs;
      return (function() {
        ip = (function() {
          at = this._idxConsumedBy((function() {
            return ss = this._many((function() {
              return this._apply("inspace")
            }))
          }));
          return 1 + ss.length
        }).call(this);
        this._applyWithArgs("keyword", 'ometa');
        n = this._apply("name");
        sn = this._or((function() {
          return (function() {
            this._applyWithArgs("keyword", 'extends');
            return this._apply("name")
          }).call(this)
        }), (function() {
          return (function() {
            at = this._idxConsumedBy((function() {
              return this._apply("empty")
            }));
            return 'OMeta'
          }).call(this)
        }));
        this._applyWithArgs("moredent", ip);
        p = this._apply("linePos");
        r = this._apply("rule");
        rs = this._many((function() {
          return (function() {
            this._applyWithArgs("nodent", p);
            return this._apply("rule")
          }).call(this)
        }));
        return this._applyWithArgs("foreign", BSOMetaOptimizer, 'optimizeGrammar', ['Grammar', n, sn, r].concat(rs))
      }).call(this)
    }
  });;

  BSOMetaTranslator = subclass(OMeta, {
    "App": function() {
      var args, rule;
      return this._or((function() {
        return (function() {
          at = this._idxConsumedBy((function() {
            return (function() {
              this._applyWithArgs("exactly", "super");
              return args = this._many1((function() {
                return this._apply("anything")
              }))
            }).call(this)
          }));
          return [this.sName, '._superApplyWithArgs(this,', args.join(), ')'].join('')
        }).call(this)
      }), (function() {
        return (function() {
          at = this._idxConsumedBy((function() {
            return (function() {
              rule = this._apply("anything");
              return args = this._many1((function() {
                return this._apply("anything")
              }))
            }).call(this)
          }));
          return ['this._applyWithArgs("', rule, '",', args.join(), ')'].join('')
        }).call(this)
      }), (function() {
        return (function() {
          at = this._idxConsumedBy((function() {
            return rule = this._apply("anything")
          }));
          return ['this._apply("', rule, '")'].join('')
        }).call(this)
      }))
    },
    "Act": function() {
      var expr;
      return (function() {
        at = this._idxConsumedBy((function() {
          return expr = this._apply("anything")
        }));
        return expr
      }).call(this)
    },
    "Pred": function() {
      var expr;
      return (function() {
        at = this._idxConsumedBy((function() {
          return expr = this._apply("anything")
        }));
        return ['this._pred(', expr, ')'].join('')
      }).call(this)
    },
    "Or": function() {
      var xs;
      return (function() {
        at = this._idxConsumedBy((function() {
          return xs = this._many((function() {
            return this._apply("transFn")
          }))
        }));
        return ['this._or(', xs.join(), ')'].join('')
      }).call(this)
    },
    "XOr": function() {
      var xs;
      return (function() {
        at = this._idxConsumedBy((function() {
          return (function() {
            xs = this._many((function() {
              return this._apply("transFn")
            }));
            return xs.unshift(programString(this.name + "." + this.rName))
          }).call(this)
        }));
        return ['this._xor(', xs.join(), ')'].join('')
      }).call(this)
    },
    "And": function() {
      var xs, y;
      return this._or((function() {
        return (function() {
          at = this._idxConsumedBy((function() {
            return (function() {
              xs = this._many((function() {
                return this._applyWithArgs("notLast", 'trans')
              }));
              y = this._apply("trans");
              return xs.push('return ' + y)
            }).call(this)
          }));
          return ['(function(){', xs.join(';'), '}).call(this)'].join('')
        }).call(this)
      }), (function() {
        return (function() {
          at = this._idxConsumedBy((function() {
            return undefined
          }));
          return 'undefined'
        }).call(this)
      }))
    },
    "Opt": function() {
      var x;
      return (function() {
        at = this._idxConsumedBy((function() {
          return x = this._apply("transFn")
        }));
        return ['this._opt(', x, ')'].join('')
      }).call(this)
    },
    "Many": function() {
      var x;
      return (function() {
        at = this._idxConsumedBy((function() {
          return x = this._apply("transFn")
        }));
        return ['this._many(', x, ')'].join('')
      }).call(this)
    },
    "Many1": function() {
      var x;
      return (function() {
        at = this._idxConsumedBy((function() {
          return x = this._apply("transFn")
        }));
        return ['this._many1(', x, ')'].join('')
      }).call(this)
    },
    "Set": function() {
      var n, v;
      return (function() {
        at = this._idxConsumedBy((function() {
          return (function() {
            n = this._apply("anything");
            return v = this._apply("trans")
          }).call(this)
        }));
        return [n, '=', v].join('')
      }).call(this)
    },
    "Not": function() {
      var x;
      return (function() {
        at = this._idxConsumedBy((function() {
          return x = this._apply("transFn")
        }));
        return ['this._not(', x, ')'].join('')
      }).call(this)
    },
    "Lookahead": function() {
      var x;
      return (function() {
        at = this._idxConsumedBy((function() {
          return x = this._apply("transFn")
        }));
        return ['this._lookahead(', x, ')'].join('')
      }).call(this)
    },
    "Form": function() {
      var x;
      return (function() {
        at = this._idxConsumedBy((function() {
          return x = this._apply("transFn")
        }));
        return ['this._form(', x, ')'].join('')
      }).call(this)
    },
    "ConsBy": function() {
      var x;
      return (function() {
        at = this._idxConsumedBy((function() {
          return x = this._apply("transFn")
        }));
        return ['this._consumedBy(', x, ')'].join('')
      }).call(this)
    },
    "IdxConsBy": function() {
      var x;
      return (function() {
        at = this._idxConsumedBy((function() {
          return x = this._apply("transFn")
        }));
        return ['this._idxConsumedBy(', x, ')'].join('')
      }).call(this)
    },
    "JumpTable": function() {
      var cases;
      return (function() {
        at = this._idxConsumedBy((function() {
          return cases = this._many((function() {
            return this._apply("jtCase")
          }))
        }));
        return this.jumpTableCode(cases)
      }).call(this)
    },
    "Interleave": function() {
      var xs;
      return (function() {
        at = this._idxConsumedBy((function() {
          return xs = this._many((function() {
            return this._apply("intPart")
          }))
        }));
        return ['this._interleave(', xs.join(), ')'].join('')
      }).call(this)
    },
    "Rule": function() {
      var name, ls, body;
      return (function() {
        at = this._idxConsumedBy((function() {
          return (function() {
            name = this._apply("anything");
            this.rName = name;
            ls = this._apply("locals");
            return body = this._apply("trans")
          }).call(this)
        }));
        return ['\n"', name, '":function(){', ls, 'return ', body, '}'].join('')
      }).call(this)
    },
    "Grammar": function() {
      var name, sName, rules;
      return (function() {
        at = this._idxConsumedBy((function() {
          return (function() {
            name = this._apply("anything");
            sName = this._apply("anything");
            this.name = name;
            this.sName = sName;
            return rules = this._many((function() {
              return this._apply("trans")
            }))
          }).call(this)
        }));
        return [name, '=subclass(', sName, ',{', rules.join(), '});'].join('')
      }).call(this)
    },
    "intPart": function() {
      var mode, part;
      return (function() {
        at = this._idxConsumedBy((function() {
          return this._form((function() {
            return (function() {
              mode = this._apply("anything");
              return part = this._apply("transFn")
            }).call(this)
          }))
        }));
        return programString(mode) + "," + part
      }).call(this)
    },
    "jtCase": function() {
      var x, e;
      return (function() {
        at = this._idxConsumedBy((function() {
          return this._form((function() {
            return (function() {
              x = this._apply("anything");
              return e = this._apply("trans")
            }).call(this)
          }))
        }));
        return [programString(x), e]
      }).call(this)
    },
    "locals": function() {
      var vs;
      return this._or((function() {
        return (function() {
          at = this._idxConsumedBy((function() {
            return this._form((function() {
              return vs = this._many1((function() {
                return this._apply("string")
              }))
            }))
          }));
          return ['var ', vs.join(), ';'].join('')
        }).call(this)
      }), (function() {
        return (function() {
          at = this._idxConsumedBy((function() {
            return this._form((function() {
              return undefined
            }))
          }));
          return ''
        }).call(this)
      }))
    },
    "trans": function() {
      var t, ans;
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
    },
    "transFn": function() {
      var x;
      return (function() {
        at = this._idxConsumedBy((function() {
          return x = this._apply("trans")
        }));
        return ['(function(){return ', x, '})'].join('')
      }).call(this)
    }
  });;

  BSOMetaTranslator.prototype.jumpTableCode = function(cases) {
    var key, val;
    return "(function(){switch(this._apply(\'anything\')){" + ((function() {
      var _i, _len, _ref1, _results;
      _results = [];
      for (_i = 0, _len = cases.length; _i < _len; _i++) {
        _ref1 = cases[_i], key = _ref1[0], val = _ref1[1];
        _results.push("case " + key + ":return " + val + ";");
      }
      return _results;
    })()).join('') + "default: throw this.fail}}).call(this)";
  };

  module.exports = {
    BSOMetaParser: BSOMetaParser,
    BSOMetaTranslator: BSOMetaTranslator
  };

}).call(this);