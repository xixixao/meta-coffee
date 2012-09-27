ometa ModuleCreator <: BSOMetaJSTranslator {
  file = ^trans:all -> ("""define([\
                             'cs!../src/ometa-base',\
                             'cs!../src/lib'\
                           ],  function (OMeta, OMLib){\
                           subclass = OMLib.subclass;""" + all +
                        """\napi = {\
                            BSOMetaJSParser: BSOMetaJSParser,\
                            BSOMetaJSTranslator: BSOMetaJSTranslator\
                          }\
                          $.extend(OMeta.interpreters, api);\
                          return api;\
                        });""")

}

ModuleCreator.match(BSOMetaJSParser.matchAll("bla;", "topLevel"), "file");
