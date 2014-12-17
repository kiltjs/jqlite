
/*
 * jqlite - JavaScript library to query and manipulate DOM 

 * The MIT License (MIT)
 * 
 * Copyright (c) 2014 Jesús Manuel Germade Castiñeiras <jesus@germade.es>
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 */

(function (root, factory) {

  if ( typeof window === 'undefined' ) {
    if ( typeof module !== 'undefined' ) {
      module.exports = factory();
    }
  } else {
    if ( typeof fn === 'function' ) {
      fn.define('$', factory );
    } if ( typeof define === 'function' && define.amd ) {
      define(['$'], factory);
    } else {
      root.jqlite = factory();
      if( !root.$ ) {
        root.$ = root.jqlite;
      }
    }
  }

})(this, function () {
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
      RE_IS_ID = /^\#[^\.\[]/,
      RE_IS_CLASS = /^\.[^#\[]/,
      ready = function (arg) {
        if( callback instanceof Function ) {
          if( ready.ready ) {
            callback.call(document);
          } else {
            ready.onceListeners.push(callback);
          }
        } else if ( callback === undefined ) {
          return ready.isReady;
        }
      };

  ready.isReady = false;
  ready.ready = function () {
    ready.isReady = true;
    for( var i = 0, len = ready.onceListeners.length; i < len; i++) {
      ready.onceListeners[i].call(document);
    }
    ready.onceListeners.splice(0, len);
  };
  ready.onceListeners = [];

  if ( document.addEventListener ) {
      document.addEventListener( "DOMContentLoaded", function(){
        // document.removeEventListener( "DOMContentLoaded", arguments.callee, false );
        ready.ready();
      }, false );
  } else if ( document.attachEvent ) {
    document.attachEvent("onreadystatechange", function(){
      if ( document.readyState === "complete" ) {
        // document.detachEvent( "onreadystatechange", arguments.callee );
        ready.ready();
      }
    });
  }

  // List of elements

  var auxArray = [];
    
  function ListDOM(elems){}
  
  ListDOM.prototype = [];
  
  ListDOM.fn = function(name,elementDo,collectionDo) {
      if( typeof name === 'string' ) {
        if( elementDo instanceof Function ) {
            if( !Element.prototype[name] ) Element.prototype[name] = elementDo;
        }
        if( collectionDo instanceof Function ) {
          ListDOM.prototype[name] = collectionDo;
          NodeList.prototype[name] = collectionDo;
        }
      } else if( name instanceof Object && arguments.length == 1 ) {
        for( var key in name ) {
          ListDOM.fn(key,name[key].element,name[key].collection);
        }
      } else if( name instanceof Array ) {
        for( var i = 0, len = name.length; i < len; i++ ) {
          ListDOM.fn(name[i], elementDo, collectionDo);
        }
      }
  };
  
  ListDOM.fn({
     'get': {
          element: function(){ return this; },
          collection: function(pos){ return pos ? this[pos] : this; }
     },
     'find': {
          element: function(selector){
              return new ListDOM( Element.prototype.querySelectorAll.apply(this,arguments) );
          },
          collection: function(selector){
              var elems = new ListDOM(), found;
              
              for( var i = 0, len = this.length; i < len; i++ ) {
                  found = this[i].querySelectorAll(selector);
                  for( var j = 0, len2 = found.length; j < len2 ; j++ ) {
                      if( !found.item(j).___found___ ) {
                          elems.push(found.item(j));
                          found.item(j).___found___ = true;
                      }
                  }
              }
              for( i = 0, len = elems.length; i < len ; i++ ) delete elems[i].___found___;
              
              return elems;
          }
     },
     'each': {
          element: function(each){
              if( each instanceof Function ) each.call(this,this);
              return this;
          },
          collection: function(each){
              if( each instanceof Function ) {
                for( var i = 0, len = this.length, elem; i < len ; i++ ) {
                    each.call(this[i], this[i]);
                }
              }
              return this;
          }
     },
     'filter': {
          element: function(selector){
              return Element.prototype.matchesSelector.call(this,selector) ? this : false;
          },
          collection: function(selector){
              var elems = [], i, len;
              
              if( selector instanceof Function ) {
                for( i = 0, len = this.length, elem; i < len ; i++ ) {
                    elem = this[i];
                    if( selector.apply(elem,[elem]) ) elems.push(elem);
                }
                  
                return new ListDOM(elems);
                  
              } else if( typeof selector === 'string' ) {
                  for( i = 0, len = this.length, elem; i < len ; i++ ) {
                    elem = this[i];
                    if( Element.prototype.matchesSelector.call(elem,selector) ) elems.push(elem);
                  }
                  
                  return new ListDOM(elems);
              }
              return false;
          }
     },
     'children': {
        element: false,
        collection: document.body.children ? function(selector,args){
          var elems = new ListDOM();
          
          for( var i = 0, len = this.length; i < len; i++ ) {
            [].push.apply(elems,this[i].children);
          }
            
          if( selector ) {
            if( isString(selector) ) {
              elems = elems.filter(selector);
            } else if( isFunction(selector) ) elems.each(selector);
          }
          return elems;

        } : function (selector, args) {
          var elems = [], elem;

          if( isString(selector) ) {
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
          return new ListDOM(elems);
        }
     },
     'data': {
          element: document.body.dataset ? function (key,value) {
            if( value === undefined ) {
              return key ? this.dataset[key] : this.dataset;
            } else {
              this.dataset[key] = value;
            }
          } : function (key, value) {
            if( value === undefined ) {
              return this.getAttribute(key);
            } else {
              this.setAttribute(key, value);
              return this;
            }
          },
          collection: document.body.dataset ? function (key,value) {
            var i, len;
            if( value === undefined ) {
              var values = [];
              for( i = 0, len = this.length; i < len ; i++ ) {
                values.push( key ? this[i].dataset[key] : this[i].dataset );
              }
              return values;
            } else {
              for( i = 0, len = this.length; i < len ; i++ ) {
                this[i].dataset[key] = value;
              }
              return this;
            }
          } : function () {
            var i, len;
            if( value === undefined ) {
              var values = [];
              for( i = 0, len = this.length; i < len ; i++ ) {
                values.push( this[i].getAttribute('data-' + key) );
              }
            } else {
              for( i = 0, len = this.length; i < len ; i++ ) {
                this[i].setAttribute('data-' + key, value);
              }
            }
          }
     },
     'attr': {
          element: function (key,value) {
            if( value !== undefined ) {
              this.setAttribute(key,value);
            } else {
              return this.getAttribute(key);
            }
            return this;
          },
          collection: function (key,value) {
            var i, len;
            if( value !== undefined ) {
              for( i = 0, len = this.length; i < len ; i++ ) {
                this[i].setAttribute(key,value);
              }
            } else if( key ) {
              for( i = 0, len = this.length; i < len ; i++ ) {
                this[i].getAttribute(key);
              }
            }
            return this;
          }
     },
     'addClass': {
         element: document.createElement('div').classList ? function (className) {
            this.classList.add(className);
            return this;
          } : function(className){
              if(!this.className) this.className = '';
              var patt = new RegExp('\\b'+className+'\\b','');
              if(!patt.test(this.className)) this.className += ' '+className;
              return this;
         },
         collection: function (className) {
            for( var i = 0, len = this.length; i < len ; i++ ) {
                this[i].addClass(className);
            }
            return this;
        }
     },
     'removeClass': {
        element: document.createElement('div').classList ? function (className) {
            this.classList.remove(className);
            return this;
        } : function(className){
            if(this.className) {
                var patt = new RegExp('(\\b|\\s+)'+className+'\\b','g');
                this.className = this.className.replace(patt,'');
            }
            return this;
        },
        collection: function (className) {
            for( var i = 0, len = this.length; i < len ; i++ ) {
                this[i].removeClass(className);
            }
            return this;
        }
     },
     'hasClass': {
        element: document.createElement('div').classList ? function (className) {
            return this.classList.item(className);
        } : function(className){
            if(!this.className) return false;
            patt = new RegExp('\\b'+className+'\\b','');
            return patt.test(this.className);
        },
        collection: function (className) {
            for( var i = 0, len = this.length; i < len ; i++ ) {
                if( element.hasClass(className) ) {
                    return true;
                }
            }
            return false;
        }
     },
     'parent': {
         element: function () {
              if( this == document.body ) return false;
              return this.parentElement || this.parentNode;
         },
         collection: function () {
            var items = new ListDOM(), parent;
            
            for( var i = 0, len = this.length; i < len ; i++ ) {
                parent = this[i].parent();
                if(parent) items.push(parent);
            }
            
            return items;
         }
     },
     'render': {
         element: function (html) {
          this.innerHTML = html;
          this.find('script').each(function(script){
            var runScripts = eval;
            if( script.type == 'text/javascript' ) {
              try{ runScripts('(function(){ \'use strict\';'+script.textContent+'})();'); }catch(err){ throw err.message; }
            } else if( /^text\/coffee(script)/.test(script.type) && isObject(window.CoffeeScript) ) {
              if( CoffeeScript.compile instanceof Function ) {
                try{ runScripts(CoffeeScript.compile(script.textContent)); }catch(err){ console.log(err.message); }
              }
            }
          });
          
          return this;
         },
         collection: function (html) {
            for( var i = 0, len = this.length; i < len ; i++ ) {
              this[i].render(html);
            }
            return this;
         }
      },
      'text': {
        element: function (text) {
          if( text === undefined ) {
            return this.textContent;
          } else {
            this.textContent = text;
            return this;
          }
        },
        collection: function (text) {
          var i, len;
            if( text === undefined ) {
              text = '';
              for( i = 0, len = this.length; i < len ; i++ ) {
                text += this[i].textContent;
              }
              return text;
            } else {
              for( i = 0, len = this.length; i < len ; i++ ) {
                this[i].textContent = text;
              }
            }
            return this;
        }
      },
      'on':{
          element: function (event,handler) {
              var elem = this;
              if( isString(event) ) {
                  if(isFunction(handler)) {
                      var originalHandler = handler;
                      handler = function(e){
                          originalHandler.apply(e.target,[e].concat(e.data));
                      };
                      
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
                              handler = handlers.pop();
                              while( handler ) {
                                  if (elem.removeEventListener) elem.removeEventListener (event, handler, false);  // all browsers except IE before version 9
                                  else if (elem.detachEvent) elem.detachEvent ('on'+event, handler);   // IE before version 9
                                  handler = handlers.pop();
                              }
                          }
                      }
                  }
              }
              
              return this;
          },
          collection: function (event,handler) {
              Array.prototype.forEach.call(this,function(elem){
                  elem.on(event,handler);
              });
              
              return this;
          }
      },
      'off': {
          element: function (event) { this.on(event,false); },
          collection: function (event) { this.on(event,false); }
      },
      'trigger': {
          element: function (event,data) {
              triggerEvent(this, event, data);
          },
          collection: function (event,data){
              Array.prototype.forEach.call(this,function(elem){
                  triggerEvent(elem, event, data);
              });
          }
      },
      ready: {
        element: ready,
        collection: ready
      }
  });

  var auxDiv = document.createElement('div');

  function pushMatches( list, matches ) {
    auxArray.push.apply( list, matches ); 
    return list;
  }

  function stringMatches (selector) {
    switch ( selector[0] ) {
      case '#':
        var found = document.getElementById(selector.substr(1));
        if( found ) {
          var listdom = new ListDOM();
          listdom.push(found);
          return listdom;
        } else return document.querySelectorAll(selector);
        break;
      case '<':
        auxDiv.innerHTML = selector;
        return pushMatches( new ListDOM(), auxDiv.children );
      default:
        return document.querySelectorAll(selector);
    }
  }

  function initList(selector) {

    switch( (selector || {}).constructor.name ) {
      case 'Array':
      case 'NodeList':
      case 'HTMLCollection':
        return pushMatches( new ListDOM(), selector );
      case 'Element':
      case 'HTMLElement':
        var list = new ListDOM();
        list.push(selector);
        return list;
    }

    if( selector === document ) {
      var list2 = new ListDOM();
      list2.push(selector);
      return list2;
    }
    if( selector instanceof Function ) ready(selector);
  }
  
  function jqlite (selector){
    if( typeof selector === 'string' ) {
      return stringMatches(selector);
    }
    return initList(selector);
  }

  return jqlite;
  
});