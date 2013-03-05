define([ "./ometa-base", "./ometa-lib", "coffee-script", "./bs-ometa-compiler" ], function(OMeta, OMLib, BSCoffeeScriptCompiler, BSOMetaCompiler) {
    var BSDentParser, BSOMetaParser, BSOMetaTranslator, api, compileCoffeeScript, extend, subclass;
    subclass = OMLib.subclass, extend = OMLib.extend;
    BSDentParser = OMeta.interpreters.BSDentParser;
    BSOMetaParser = BSOMetaCompiler.BSOMetaParser;
    BSOMetaTranslator = BSOMetaCompiler.BSOMetaTranslator;
    BSMetaCoffeeParser = subclass(BSDentParser, {
        ometa: function() {
            var first, ss, g;
            return function() {
                first = this._apply("anything");
                this._or(function() {
                    return this._pred(first);
                }, function() {
                    return function() {
                        switch (this._apply("anything")) {
                          case "\n":
                            return "\n";

                          default:
                            throw this.fail;
                        }
                    }.call(this);
                });
                ss = this._many(function() {
                    return this._apply("inspace");
                });
                this._applyWithArgs("prepend", ss);
                g = this._applyWithArgs("foreign", BSOMetaParser, "grammar");
                return [ "OMeta", ss.join(""), g ];
            }.call(this);
        },
        coffee: function() {
            var x, xs;
            return function() {
                x = this._apply("anything");
                xs = this._many(function() {
                    return function() {
                        this._not(function() {
                            return this._applyWithArgs("ometa", !1);
                        });
                        return this._apply("anything");
                    }.call(this);
                });
                return [ "CoffeeScript", x + xs.join("") ];
            }.call(this);
        },
        topLevel: function() {
            var x, xs;
            return this._or(function() {
                return function() {
                    x = this._or(function() {
                        return function() {
                            this._many(function() {
                                return this._apply("blankLine");
                            });
                            return this._applyWithArgs("ometa", !0);
                        }.call(this);
                    }, function() {
                        return this._apply("coffee");
                    });
                    xs = this._many(function() {
                        return this._or(function() {
                            return this._applyWithArgs("ometa", !1);
                        }, function() {
                            return this._apply("coffee");
                        });
                    });
                    return [ x ].concat(xs);
                }.call(this);
            }, function() {
                return function() {
                    this._apply("end");
                    return [ [ "CoffeeScript", "" ] ];
                }.call(this);
            });
        }
    });
    compileCoffeeScript = function(source) {
        var result;
        try {
            result = BSCoffeeScriptCompiler.compile(source, {
                bare: !0
            });
        } catch (e) {
            throw "" + source + "\n\n" + ("" + e);
        }
        return result;
    };
    BSMetaCoffeeTranslator = subclass(OMeta, {
        trans: function() {
            var t, ans, xs;
            return function() {
                xs = this._many(function() {
                    return function() {
                        this._form(function() {
                            return function() {
                                t = this._apply("anything");
                                return ans = this._applyWithArgs("apply", t);
                            }.call(this);
                        });
                        return ans;
                    }.call(this);
                });
                return compileCoffeeScript(xs.join(""));
            }.call(this);
        },
        CoffeeScript: function() {
            return this._apply("anything");
        },
        OMeta: function() {
            var ss, t, js;
            return function() {
                ss = this._apply("anything");
                t = this._apply("anything");
                js = this._applyWithArgs("foreign", BSOMetaTranslator, "trans", t);
                return "\n" + ss + "`" + js + "`\n";
            }.call(this);
        }
    });
    api = {
        BSMetaCoffeeParser: BSMetaCoffeeParser,
        BSMetaCoffeeTranslator: BSMetaCoffeeTranslator
    };
    extend(OMeta.interpreters, api);
    return api;
});