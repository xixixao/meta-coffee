(function() {
  var JumpTable, OMeta, extend, programString, propertyNames, subclass, _ref;

  OMeta = require('./ometa-base');

  _ref = require('./ometa-lib'), subclass = _ref.subclass, propertyNames = _ref.propertyNames, programString = _ref.programString, extend = _ref.extend;

  BSNullOptimization = subclass(OMeta, {
    "setHelped": function() {
      return this._didSomething = true
    },
    "helped": function() {
      return this._pred(this._didSomething)
    },
    "trans": function() {
      var t, ans;
      return (function() {
        at = this._idxConsumedBy((function() {
          return this._form((function() {
            return (function() {
              t = this._apply("anything");
              this._pred(this[t] != null);
              return ans = this._applyWithArgs("apply", t)
            }).call(this)
          }))
        }));
        return ans
      }).call(this)
    },
    "optimize": function() {
      var x;
      return (function() {
        at = this._idxConsumedBy((function() {
          return (function() {
            x = this._apply("trans");
            return this._apply("helped")
          }).call(this)
        }));
        return x
      }).call(this)
    },
    "App": function() {
      var rule, args;
      return (function() {
        at = this._idxConsumedBy((function() {
          return (function() {
            rule = this._apply("anything");
            return args = this._many((function() {
              return this._apply("anything")
            }))
          }).call(this)
        }));
        return ['App', rule].concat(args)
      }).call(this)
    },
    "Act": function() {
      var expr;
      return (function() {
        at = this._idxConsumedBy((function() {
          return expr = this._apply("anything")
        }));
        return ['Act', expr]
      }).call(this)
    },
    "Pred": function() {
      var expr;
      return (function() {
        at = this._idxConsumedBy((function() {
          return expr = this._apply("anything")
        }));
        return ['Pred', expr]
      }).call(this)
    },
    "Or": function() {
      var xs;
      return (function() {
        at = this._idxConsumedBy((function() {
          return xs = this._many((function() {
            return this._apply("trans")
          }))
        }));
        return ['Or'].concat(xs)
      }).call(this)
    },
    "XOr": function() {
      var xs;
      return (function() {
        at = this._idxConsumedBy((function() {
          return xs = this._many((function() {
            return this._apply("trans")
          }))
        }));
        return ['XOr'].concat(xs)
      }).call(this)
    },
    "And": function() {
      var xs;
      return (function() {
        at = this._idxConsumedBy((function() {
          return xs = this._many((function() {
            return this._apply("trans")
          }))
        }));
        return ['And'].concat(xs)
      }).call(this)
    },
    "Opt": function() {
      var x;
      return (function() {
        at = this._idxConsumedBy((function() {
          return x = this._apply("trans")
        }));
        return ['Opt', x]
      }).call(this)
    },
    "Many": function() {
      var x;
      return (function() {
        at = this._idxConsumedBy((function() {
          return x = this._apply("trans")
        }));
        return ['Many', x]
      }).call(this)
    },
    "Many1": function() {
      var x;
      return (function() {
        at = this._idxConsumedBy((function() {
          return x = this._apply("trans")
        }));
        return ['Many1', x]
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
        return ['Set', n, v]
      }).call(this)
    },
    "Not": function() {
      var x;
      return (function() {
        at = this._idxConsumedBy((function() {
          return x = this._apply("trans")
        }));
        return ['Not', x]
      }).call(this)
    },
    "Lookahead": function() {
      var x;
      return (function() {
        at = this._idxConsumedBy((function() {
          return x = this._apply("trans")
        }));
        return ['Lookahead', x]
      }).call(this)
    },
    "Form": function() {
      var x;
      return (function() {
        at = this._idxConsumedBy((function() {
          return x = this._apply("trans")
        }));
        return ['Form', x]
      }).call(this)
    },
    "ConsBy": function() {
      var x;
      return (function() {
        at = this._idxConsumedBy((function() {
          return x = this._apply("trans")
        }));
        return ['ConsBy', x]
      }).call(this)
    },
    "IdxConsBy": function() {
      var x;
      return (function() {
        at = this._idxConsumedBy((function() {
          return x = this._apply("trans")
        }));
        return ['IdxConsBy', x]
      }).call(this)
    },
    "JumpTable": function() {
      var c, e, ces;
      return (function() {
        at = this._idxConsumedBy((function() {
          return ces = this._many((function() {
            return (function() {
              at = this._idxConsumedBy((function() {
                return this._form((function() {
                  return (function() {
                    c = this._apply("anything");
                    return e = this._apply("trans")
                  }).call(this)
                }))
              }));
              return [c, e]
            }).call(this)
          }))
        }));
        return ['JumpTable'].concat(ces)
      }).call(this)
    },
    "Interleave": function() {
      var m, p, xs;
      return (function() {
        at = this._idxConsumedBy((function() {
          return xs = this._many((function() {
            return (function() {
              at = this._idxConsumedBy((function() {
                return this._form((function() {
                  return (function() {
                    m = this._apply("anything");
                    return p = this._apply("trans")
                  }).call(this)
                }))
              }));
              return [m, p]
            }).call(this)
          }))
        }));
        return ['Interleave'].concat(xs)
      }).call(this)
    },
    "Rule": function() {
      var name, ls, body;
      return (function() {
        at = this._idxConsumedBy((function() {
          return (function() {
            name = this._apply("anything");
            ls = this._apply("anything");
            return body = this._apply("trans")
          }).call(this)
        }));
        return ['Rule', name, ls, body]
      }).call(this)
    },
    "initialize": function() {
      return (function() {
        at = this._idxConsumedBy((function() {
          return undefined
        }));
        return this._didSomething = false
      }).call(this)
    }
  });;

  BSAssociativeOptimization = subclass(BSNullOptimization, {
    "And": function() {
      var x, xs;
      return this._or((function() {
        return (function() {
          at = this._idxConsumedBy((function() {
            return (function() {
              x = this._apply("trans");
              this._apply("end");
              return this._apply("setHelped")
            }).call(this)
          }));
          return x
        }).call(this)
      }), (function() {
        return (function() {
          at = this._idxConsumedBy((function() {
            return xs = this._applyWithArgs("transInside", 'And')
          }));
          return ['And'].concat(xs)
        }).call(this)
      }))
    },
    "Or": function() {
      var x, xs;
      return this._or((function() {
        return (function() {
          at = this._idxConsumedBy((function() {
            return (function() {
              x = this._apply("trans");
              this._apply("end");
              return this._apply("setHelped")
            }).call(this)
          }));
          return x
        }).call(this)
      }), (function() {
        return (function() {
          at = this._idxConsumedBy((function() {
            return xs = this._applyWithArgs("transInside", 'Or')
          }));
          return ['Or'].concat(xs)
        }).call(this)
      }))
    },
    "XOr": function() {
      var x, xs;
      return this._or((function() {
        return (function() {
          at = this._idxConsumedBy((function() {
            return (function() {
              x = this._apply("trans");
              this._apply("end");
              return this._apply("setHelped")
            }).call(this)
          }));
          return x
        }).call(this)
      }), (function() {
        return (function() {
          at = this._idxConsumedBy((function() {
            return xs = this._applyWithArgs("transInside", 'XOr')
          }));
          return ['XOr'].concat(xs)
        }).call(this)
      }))
    },
    "transInside": function() {
      var t, xs, ys, x;
      return (function() {
        t = this._apply("anything");
        return this._or((function() {
          return (function() {
            at = this._idxConsumedBy((function() {
              return (function() {
                this._form((function() {
                  return (function() {
                    this._applyWithArgs("exactly", t);
                    return xs = this._applyWithArgs("transInside", t)
                  }).call(this)
                }));
                ys = this._applyWithArgs("transInside", t);
                return this._apply("setHelped")
              }).call(this)
            }));
            return xs.concat(ys)
          }).call(this)
        }), (function() {
          return (function() {
            at = this._idxConsumedBy((function() {
              return (function() {
                x = this._apply("trans");
                return xs = this._applyWithArgs("transInside", t)
              }).call(this)
            }));
            return [x].concat(xs)
          }).call(this)
        }), (function() {
          return (function() {
            at = this._idxConsumedBy((function() {
              return undefined
            }));
            return []
          }).call(this)
        }))
      }).call(this)
    }
  });;

  BSSeqInliner = subclass(BSNullOptimization, {
    "App": function() {
      var s, cs, rule, args;
      return this._or((function() {
        return (function() {
          at = this._idxConsumedBy((function() {
            return (function() {
              this._applyWithArgs("exactly", "seq");
              s = this._apply("anything");
              this._apply("end");
              cs = this._applyWithArgs("seqString", s);
              return this._apply("setHelped")
            }).call(this)
          }));
          return ['And'].concat(cs).concat([
            ['Act', s]
          ])
        }).call(this)
      }), (function() {
        return (function() {
          at = this._idxConsumedBy((function() {
            return (function() {
              rule = this._apply("anything");
              return args = this._many((function() {
                return this._apply("anything")
              }))
            }).call(this)
          }));
          return ['App', rule].concat(args)
        }).call(this)
      }))
    },
    "inlineChar": function() {
      var BSOMetaParser, c;
      return (function() {
        at = this._idxConsumedBy((function() {
          return (function() {
            BSOMetaParser = (require('./bs-ometa-compiler')).BSOMetaParser;
            c = this._applyWithArgs("foreign", BSOMetaParser, 'escapedChar');
            return this._not((function() {
              return this._apply("end")
            }))
          }).call(this)
        }));
        return ['App', 'exactly', programString(c)]
      }).call(this)
    },
    "seqString": function() {
      var s, cs;
      return (function() {
        this._lookahead((function() {
          return (function() {
            s = this._apply("anything");
            return this._pred(typeof s === 'string')
          }).call(this)
        }));
        return this._or((function() {
          return (function() {
            at = this._idxConsumedBy((function() {
              return this._form((function() {
                return (function() {
                  this._applyWithArgs("exactly", "\"");
                  cs = this._many((function() {
                    return this._apply("inlineChar")
                  }));
                  return this._applyWithArgs("exactly", "\"")
                }).call(this)
              }))
            }));
            return cs
          }).call(this)
        }), (function() {
          return (function() {
            at = this._idxConsumedBy((function() {
              return this._form((function() {
                return (function() {
                  this._applyWithArgs("exactly", "\'");
                  cs = this._many((function() {
                    return this._apply("inlineChar")
                  }));
                  return this._applyWithArgs("exactly", "\'")
                }).call(this)
              }))
            }));
            return cs
          }).call(this)
        }))
      }).call(this)
    }
  });;

  JumpTable = (function() {

    function JumpTable(choiceOp, choice) {
      this.choiceOp = choiceOp;
      this.choices = {};
      this.add(choice);
      return;
    }

    JumpTable.prototype.add = function(choice) {
      var c, t;
      c = choice[0], t = choice[1];
      if (this.choices[c]) {
        if (this.choices[c][0] === this.choiceOp) {
          this.choices[c].push(t);
        } else {
          this.choices[c] = [this.choiceOp, this.choices[c], t];
        }
      } else {
        this.choices[c] = t;
      }
    };

    JumpTable.prototype.toTree = function() {
      var choiceKey, choiceKeys, r, _i, _len;
      r = ['JumpTable'];
      choiceKeys = propertyNames(this.choices);
      for (_i = 0, _len = choiceKeys.length; _i < _len; _i++) {
        choiceKey = choiceKeys[_i];
        r.push([choiceKey, this.choices[choiceKey]]);
      }
      return r;
    };

    return JumpTable;

  })();

  BSJumpTableOptimization = subclass(BSNullOptimization, {
    "Or": function() {
      var cs;
      return (function() {
        at = this._idxConsumedBy((function() {
          return cs = this._many((function() {
            return this._or((function() {
              return this._applyWithArgs("jtChoices", 'Or')
            }), (function() {
              return this._apply("trans")
            }))
          }))
        }));
        return ['Or'].concat(cs)
      }).call(this)
    },
    "XOr": function() {
      var cs;
      return (function() {
        at = this._idxConsumedBy((function() {
          return cs = this._many((function() {
            return this._or((function() {
              return this._applyWithArgs("jtChoices", 'XOr')
            }), (function() {
              return this._apply("trans")
            }))
          }))
        }));
        return ['XOr'].concat(cs)
      }).call(this)
    },
    "quotedString": function() {
      var BSOMetaParser, c, cs;
      return (function() {
        at = this._idxConsumedBy((function() {
          return (function() {
            BSOMetaParser = (require('./bs-ometa-compiler')).BSOMetaParser;
            this._lookahead((function() {
              return this._apply("string")
            }));
            return this._form((function() {
              return (function() {
                switch (this._apply('anything')) {
                  case "\"":
                    return (function() {
                      cs = this._many((function() {
                        return (function() {
                          at = this._idxConsumedBy((function() {
                            return (function() {
                              c = this._applyWithArgs("foreign", BSOMetaParser, 'escapedChar');
                              return this._not((function() {
                                return this._apply("end")
                              }))
                            }).call(this)
                          }));
                          return c
                        }).call(this)
                      }));
                      return this._applyWithArgs("exactly", "\"")
                    }).call(this);
                  case "\'":
                    return (function() {
                      cs = this._many((function() {
                        return (function() {
                          at = this._idxConsumedBy((function() {
                            return (function() {
                              c = this._applyWithArgs("foreign", BSOMetaParser, 'escapedChar');
                              return this._not((function() {
                                return this._apply("end")
                              }))
                            }).call(this)
                          }));
                          return c
                        }).call(this)
                      }));
                      return this._applyWithArgs("exactly", "\'")
                    }).call(this);
                  default:
                    throw this.fail
                }
              }).call(this)
            }))
          }).call(this)
        }));
        return cs.join('')
      }).call(this)
    },
    "jtChoice": function() {
      var x, rest;
      return this._or((function() {
        return (function() {
          at = this._idxConsumedBy((function() {
            return this._form((function() {
              return (function() {
                this._applyWithArgs("exactly", "And");
                this._form((function() {
                  return (function() {
                    this._applyWithArgs("exactly", "App");
                    this._applyWithArgs("exactly", "exactly");
                    return x = this._apply("quotedString")
                  }).call(this)
                }));
                return rest = this._many((function() {
                  return this._apply("anything")
                }))
              }).call(this)
            }))
          }));
          return [x, ['And'].concat(rest)]
        }).call(this)
      }), (function() {
        return (function() {
          at = this._idxConsumedBy((function() {
            return this._form((function() {
              return (function() {
                this._applyWithArgs("exactly", "App");
                this._applyWithArgs("exactly", "exactly");
                return x = this._apply("quotedString")
              }).call(this)
            }))
          }));
          return [x, ['Act', programString(x)]]
        }).call(this)
      }))
    },
    "jtChoices": function() {
      var op, c, jt;
      return (function() {
        op = this._apply("anything");
        at = this._idxConsumedBy((function() {
          return (function() {
            c = this._apply("jtChoice");
            jt = new JumpTable(op, c);
            this._many((function() {
              return (function() {
                c = this._apply("jtChoice");
                return jt.add(c)
              }).call(this)
            }));
            return this._apply("setHelped")
          }).call(this)
        }));
        return jt.toTree()
      }).call(this)
    }
  });;

  BSOMetaOptimizer = subclass(OMeta, {
    "optimizeGrammar": function() {
      var n, sn, rs;
      return (function() {
        at = this._idxConsumedBy((function() {
          return this._form((function() {
            return (function() {
              this._applyWithArgs("exactly", "Grammar");
              n = this._apply("anything");
              sn = this._apply("anything");
              return rs = this._many((function() {
                return this._apply("optimizeRule")
              }))
            }).call(this)
          }))
        }));
        return ['Grammar', n, sn].concat(rs)
      }).call(this)
    },
    "optimizeRule": function() {
      var r;
      return (function() {
        at = this._idxConsumedBy((function() {
          return (function() {
            r = this._apply("anything");
            this._or((function() {
              return r = this._applyWithArgs("foreign", BSSeqInliner, 'optimize', r)
            }), (function() {
              return this._apply("empty")
            }));
            return this._many((function() {
              return this._or((function() {
                return r = this._applyWithArgs("foreign", BSAssociativeOptimization, 'optimize', r)
              }), (function() {
                return r = this._applyWithArgs("foreign", BSJumpTableOptimization, 'optimize', r)
              }))
            }))
          }).call(this)
        }));
        return r
      }).call(this)
    }
  });;

  module.exports = BSOMetaOptimizer;

}).call(this);