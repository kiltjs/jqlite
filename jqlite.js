
(function ($) {

  if( typeof fn !== 'undefined' ) {
    fn.define('$', $)
  } else if( typeof window !== 'undefined' ) {
      if( !window.$ ) {
        window.$ = $;
      }
    }
  } else if( typeof module !== 'undefined' ) {
      module.exports = $;
    }
  }

})(function () {
  'use strict';

  if( !Element.prototype.matchesSelector ) {
    Element.prototype.matchesSelector = (
      Element.prototype.webkitMatchesSelector ||
      Element.prototype.mozMatchesSelector ||
      Element.prototype.msMatchesSelector ||
      Element.prototype.oMatchesSelector
    );
  }

  function stopEvent (e) {
    if(e) e.stopped = true;
    if (e &&e.preventDefault) e.preventDefault();
    else if (window.event && window.event.returnValue) window.eventReturnValue = false;
  }
  
  function triggerEvent (element,name,data){
    var event; // The custom event that will be created
    
    if (document.createEvent) {
      event = document.createEvent("HTMLEvents");
      event.data = data;
      event.initEvent(name, true, true);
    } else {
      event = document.createEventObject();
      event.data = data;
    }
    
    if(document.createEvent) element.dispatchEvent(event);
    else element.fireEvent("on" + event.eventType, event);
    
    return event;
  }

	var RE_HAS_SPACES = /\s/,
      RE_ONLY_LETTERS = /^[a-zA-Z]+$/,
      RE_IS_ID = /^\#.+/,
      RE_IS_CLASS = /^\..+/;
    
  function listDOM(elems){
      if( isString(elems) ) {
      	if( RE_HAS_SPACES.test(elems) ) [].push.apply(this,document.querySelectorAll(elems));
      	else {
      		if( RE_ONLY_LETTERS.test(elems) ) [].push.apply(this,document.getElementsByTagName(elems));
      		else if( RE_IS_ID.test(elems) ) [].push.call(this,document.getElementById(elems.substr(1)));
      		else if( RE_IS_CLASS.test(elems) ) [].push.apply(this,document.getElementsByClassName(elems.substr(1)));
      		else [].push.apply(this,document.querySelectorAll(elems));
      	}
      }
      else if( elems instanceof Array ) [].push.apply(this,elems);
      else if( elems instanceof NodeList ) [].push.apply(this,elems);
      else if( elems instanceof HTMLCollection ) [].push.apply(this,elems);
      else if( elems instanceof Element ) [].push.call(this,elems);
      else if( elems === document ) [].push.call(this,elems);
  }
  
  listDOM.prototype = new Array();
  
  listDOM.fn = function(name,elementDo,collectionDo) {
      if( typeof name === 'string' ) {
          if( elementDo instanceof Function ) {
              if( !Element.prototype[name] ) Element.prototype[name] = elementDo;
          }
          if( collectionDo instanceof Function ) {
            listDOM.prototype[name] = collectionDo;
            NodeList.prototype[name] = collectionDo;
          }
      } else if( name instanceof Object && arguments.length == 1 ) {
          for( var key in name ) {
            listDOM.fn(key,name[key].element,name[key].collection);
          }
      }
  };
  
  listDOM.fn({
     'get': {
          element: function(){ return this; },
          collection: function(pos){ return this[pos]; }
     },
     'find': {
          element: function(selector){
              return new listDOM( Element.prototype.querySelectorAll.apply(this,arguments) );
          },
          collection: function(selector,test){
              var elems = new listDOM(), found, list_found = {};
              
              for( var i = 0, len = this.length; i < len; i++ ) {
                  found = this[i].querySelectorAll(selector);
                  for( var j = 0, len2 = found.length; j < len2 ; j++ ) {
                      if( !found.item(j).__found ) {
                          elems.push(found.item(j));
                          found.item(j).__found = true;
                      }
                  }
              }
              for( var i = 0, len = elems.length; i < len ; i++ ) delete elems[i].__found;
              
              return elems;
          }
     },
     'each': {
          element: function(each){
              if( isFunction(each) ) each.class(this,this);
              return this;
          },
          collection: function(each){
              if( isFunction(each) ) {
                  Array.prototype.forEach.call(this,each);
              }
              return this;
          }
     },
     'filter': {
          element: function(selector){
              return Element.prototype.matchesSelector.call(this,selector) ? this : false;
          },
          collection: function(selector){
              var elems = [];
              
              if( isFunction(selector) ) {
                  Array.prototype.forEach.call(this,function(elem){
                      if( selector.apply(elem,[elem]) ) elems.push(elem);
                  });
                  
                  return new listDOM(elems);
                  
              } else if( typeof selector === 'string' ) {
                  Array.prototype.forEach.call(this,function(elem){
                      if( Element.prototype.matchesSelector.call(elem,selector) ) elems.push(elem);
                  });
                  
                  return new listDOM(elems);
              }
              return this;
          }
     },
     'children': {
     		element: false,
     		collection: function(selector,args){
     			var elems = [], elem;
     			
     			if( document.body.children ) {
     				
     				elems = new listDOM();
     				
     				Array.prototype.forEach.call(this,function(elem){
     					[].push.apply(elems,elem.children);
     				});
       				
       			if( selector ) {
     					if( isString(selector) ) {
       					elems = elems.filter(selector);
       				} else if( isFunction(selector) ) elems.each(selector);
     				}
     				
     				return elems;
     				
     			} else if( isString(selector) ) {
     				Array.prototype.forEach.call(this,function(elem){
     					elem = elem.firstElementChild || elem.firstChild;
     					
     					while(elem) {
                      	if( elem && Element.prototype.matchesSelector.call(elem,selector) ) elems.push(elem);
                      	elem = elem.nextElementSibling;
     					}
                  });
     			} else if( isFunction(selector) ) {
     				Array.prototype.forEach.call(this,function(elem){
     					elem = elem.firstElementChild || elem.firstChild;
     					while(elem) {
	       				elems.push(elem);
	       				selector.apply(elem,args);
	       				elem = elem.nextElementSibling;
     					}
     				});
     			} else {
     				Array.prototype.forEach.call(this,function(elem){
     					elem = elem.firstElementChild || elem.firstChild;
       				while(elem) {
       					elems.push(elem);
       					elem = elem.nextElementSibling;
       				}
     				});
     			}
     			return new listDOM(elems);
     		}
     },
     'data': {
          element: function(key,value){
              if( isString(key) ) {
                  if( isString(value) ) {
                      
                      if( this.getAttribute('data-'+key) != null ) this.setAttribute('data-'+key,value);
                      else {
                          if( this.dataset !== undefined ) this.dataset[key] = value;
                          else this.setAttribute('data-'+key,value);
                      }
                      return this;
                      
                  } else return this.getAttribute('data-'+key) || ( this.dataset ? this.dataset[key] : false );
              }
              return this;
          },
          collection: function(key,value){
              var elem;
              
              if( isString(key) ) {
              
                  if( !isString(value) ) return this[0].data(key);
                  else {
                      Array.prototype.forEach.call(this,function(elem){ elem.data(key,value); });
                      return this;
                  }
              }
              return this;
          }
     },
     'attr': {
          element: function(key,value){
              if( isString(key) ) {
                  if( value !== undefined ) {
                      this.setAttribute(key,value);
                      return this;
                  } else return this.getAttribute(key);
              }
              return this;
          },
          collection: function(key,value){
              var elem;
              
              if( isString(key) ) {
              
                  if( !isString(value) ) return this[0].getAttribute(key);
                  else {
                      Array.prototype.forEach.call(this,function(elem){ elem.setAttribute(key,value); });
                      return this;
                  }
              }
              return this;
          }
     },
     'addClass': {
         element: function(className){
              if(!this.className) this.className = '';
              var patt = new RegExp('\\b'+className+'\\b','');
              if(!patt.test(this.className)) this.className += ' '+className;
              return this;
         },
         collection: function(className){ Array.prototype.forEach.call(this,function(item){ item.addClass(className); }); return this; }
     },
     'removeClass': {
         element: function(className){
              if(this.className) {
                  var patt = new RegExp('(\\b|\\s+)'+className+'\\b','g');
                  this.className = this.className.replace(patt,'');
              }
              return this;
         },
         collection: function(className){ Array.prototype.forEach.call(this,function(item){ item.addClass(className); }); return this; }
     },
     'hasClass': {
          element: function(className){
              if(!this.className) return false;
              patt = new RegExp('\\b'+className+'\\b','');
              return patt.test(this.className);
          },
          collection: function(className){
              var classNames = className.trim().split(' ');
              className = '';
              classNames.forEach(function(className_part){ className += '.'+className_part; });
              
              var found = this.filter(className);
              return found.length ? found : false;
          }
     },
     'parent': {
         element: function(){
              if( this == document.body ) return false;
              return this.parentElement || this.parentNode;
         },
         collection: function(){
             var items = new listDOM(), parent;
             
             Array.prototype.forEach.call(this,function(item){ parent = item.parent(); if(parent) items.push(parent); });
             
             return items;
         }
     },
     'render': {
         element: function(html){
              this.innerHTML = html;
              this.find('script').each(function(script){
              	if( script.type == 'text/javascript' ) {
              		try{ eval('(function(){ \'use strict\';'+script.textContent+'})();'); }catch(err){ console.log(err.message); }
              	} else if( /^text\/coffee(script)/.test(script.type) && isObject(window.CoffeeScript) ) {
              		if( CoffeeScript.compile instanceof Function ) {
              			try{ eval(CoffeeScript.compile(script.textContent)); }catch(err){ console.log(err.message); }
              		}
              	}
              });
              
              return this;
         },
         collection: function(html){
             Array.prototype.forEach.call(this,function(item){ item.render(html); });
             return this;
         }
      },
      'on':{
          element: function(event,handler){
              var elem = this;
              if( isString(event) ) {
                  if(isFunction(handler)) {
                      var originalHandler = handler;
                      handler = function(e){
                          originalHandler.apply(e.target,[e].concat(e.data));
                      }
                      
                      if (elem.addEventListener)  { // W3C DOM
                          elem.addEventListener(event,handler,false);
                      } else if (elem.attachEvent) { // IE DOM
                          elem.attachEvent("on"+event, handler);
                      } else throw 'No es posible añadir evento';
                      
                      if(!elem.listeners) elem.listeners = {};
                      if( !elem.listeners[event] ) elem.listeners[event] = [];
                      
                      elem.listeners[event].push(handler);
                  } else if( handler === false ) {
                      if(elem.listeners) {
                          if( elem.listeners[event] ) {
                              var handlers = elem.listeners[event];
                              while( handler = handlers.pop() ) {
                                  if (elem.removeEventListener) elem.removeEventListener (event, handler, false);  // all browsers except IE before version 9
                                  else if (elem.detachEvent) elem.detachEvent ('on'+event, handler);   // IE before version 9
                              }
                          }
                      }
                  }
              }
              
              return this;
          },
          collection: function(event,handler){
              Array.prototype.forEach.call(this,function(elem){
                  elem.on(event,handler);
              });
              
              return this;
          }
      },
      'off': {
          element: function(event){ this.on(event,false); },
          collection: function(event){ this.on(event,false); }
      },
      'trigger': {
          element: function(event,data){
              triggerEvent(this, event, data);
          },
          collection: function(event,data){
              Array.prototype.forEach.call(this,function(elem){
                  triggerEvent(elem, event, data);
              });
          }
      }
  });
  
  return function $ (selector){
  	if( /^\<\w+.*\>$/.test(selector) ) {
  		var el = document.createElement('div');
  		el.innerHTML = selector;
  		return new listDOM(el.children);
  	}
  	return new listDOM(selector);
  };
  
});