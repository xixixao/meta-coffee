define([
  'cs!../src/ometa-base',
  'cs!../src/lib',
  '../bin/bs-js-compiler'
], function (OMeta, OMLib, BSJSCompiler){
subclass = OMLib.subclass;
BSJSParser = BSJSCompiler.BSJSParser;
BSJSTranslator = BSJSCompiler.BSJSTranslator;

BSOMetaJSParser=subclass(BSJSParser,{
"srcElem":function(){var $elf=this,_fromIdx=this.input.idx,r;return this._or((function(){return (function(){this._apply("spaces");r=this._applyWithArgs("foreign",OMeta.interpreters.BSOMetaParser,'grammar');this._apply("sc");return r}).call(this)}),(function(){return BSJSParser._superApplyWithArgs(this,'srcElem')}))}});
BSOMetaJSTranslator=subclass(BSJSTranslator,{
"Grammar":function(){var $elf=this,_fromIdx=this.input.idx;return this._applyWithArgs("foreign",OMeta.interpreters.BSOMetaTranslator,'Grammar')}});

  api = {
    BSOMetaJSParser: BSOMetaJSParser,
    BSOMetaJSTranslator: BSOMetaJSTranslator    
  }
  $.extend(OMeta.interpreters, api);
  return api;
});