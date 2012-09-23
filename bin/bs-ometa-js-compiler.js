define([
  'cs!../src/ometa-base',
  'cs!../src/lib'  
], function (OMeta, OMLib){
subclass = OMLib.subclass;

BSOMetaJSParser=subclass(BSJSParser,{
"srcElem":function(){var $elf=this,_fromIdx=this.input.idx,r;return this._or((function(){return (function(){this._apply("spaces");r=this._applyWithArgs("foreign",BSOMetaParser,'grammar');this._apply("sc");return r}).call(this)}),(function(){return BSJSParser._superApplyWithArgs(this,'srcElem')}))}});
BSOMetaJSTranslator=subclass(BSJSTranslator,{
"Grammar":function(){var $elf=this,_fromIdx=this.input.idx;return this._applyWithArgs("foreign",BSOMetaTranslator,'Grammar')}});

  api = {
    BSOMetaJSParser: BSOMetaJSParser,
    BSOMetaJSTranslator: BSOMetaJSTranslator    
  }
  $.extend(OMeta.interpreters, api);
  return api;
});