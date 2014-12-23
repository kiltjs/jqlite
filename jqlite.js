
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
      },
      classListEnabled =  document.body.classList;

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

  var auxArray = [],
      auxDiv = document.createElement('div');
    
  function ListDOM(){}
  
  ListDOM.prototype = [];

  ListDOM.prototype.get = function(pos) {
      return pos ? this[pos] : this;
    };

  ListDOM.prototype.find = function(selector) {
      var elems = new ListDOM(), found;
      
      for( var i = 0, len = this.length; i < len; i++ ) {
          found = this[i].querySelectorAll(selector);
          for( var j = 0, len2 = found.length; j < len2 ; j++ ) {
              if( !found.item(j).___found___ ) {
                  elems[elems.length] = found.item(j);
                  found.item(j).___found___ = true;
              }
          }
      }
      for( i = 0, len = elems.length; i < len ; i++ ) {
        delete elems[i].___found___;
      }
      
      return elems;
    };

  ListDOM.prototype.each = function(each) {
      if( each instanceof Function ) {
        for( var i = 0, len = this.length, elem; i < len ; i++ ) {
            each.call(this[i], this[i]);
        }
      }
      return this;
    };

  ListDOM.prototype.filter = function(selector) {
      var elems = [], i, len;
      
      if( selector instanceof Function ) {
        for( i = 0, len = this.length, elem; i < len ; i++ ) {
          elem = this[i];
          if( selector.apply(elem,[elem]) ) {
            elems.push(elem);
          }
        }
          
        return new ListDOM(elems);
          
      } else if( typeof selector === 'string' ) {
          for( i = 0, len = this.length, elem; i < len ; i++ ) {
            elem = this[i];
            if( Element.prototype.matchesSelector.call(elem,selector) ) {
              elems[elems.length] = elem;
            }
          }
          
          return new ListDOM(elems);
      }
      return false;
    };

  ListDOM.prototype.children = document.body.children ? function (selector){
      var elems = new ListDOM();
      
      for( var i = 0, len = this.length; i < len; i++ ) {
        [].push.apply(elems,this[i].children);
      }
        
      if( selector ) {
        return elems.filter(selector);
      }
      return elems;

    } : function (selector) {
      var elems = new ListDOM(), elem;

      Array.prototype.forEach.call(this,function(elem){
        elem = elem.firstElementChild || elem.firstChild;
        while(elem) {
          elems[elems.length] = elem;
          elem = elem.nextElementSibling || elem.nextSibling;
        }
      });

      if( selector ) {
        return elems.filter(selector);
      }
      return elems;
    };

  ListDOM.prototype.data = document.body.dataset ? function (key, value) {
      var i, len;
      if( value === undefined ) {
        return ( this[0] || {} ).dataset[key];
      } else {
        for( i = 0, len = this.length; i < len ; i++ ) {
          this[i].dataset[key] = value;
        }
        return this;
      }
    } : function (key, value) {
      var i, len;
      if( value === undefined ) {
        var values = [];
        for( i = 0, len = this.length; i < len ; i++ ) {
          values.push( this[i].getAttribute('data-' + key) );
        }
        return ( this[0] || { getAttribute: function() { return false; } } ).getAttribute(key);
      } else {
        for( i = 0, len = this.length; i < len ; i++ ) {
          this[i].setAttribute('data-' + key, value);
        }
      }
    };

  ListDOM.prototype.attr = function (key,value) {
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
    };

  ListDOM.prototype.addClass = classListEnabled ? function (className) {
      for( var i = 0, len = this.length; i < len ; i++ ) {
          this[i].classList.add(className);
      }
      return this;
    } : function (className) {
      var RE_CLEANCLASS = new RegExp('\\b' + (className || '') + '\\b','');

      for( var i = 0, len = this.length; i < len ; i++ ) {
          this[i].className = this[i].className.replace(RE_CLEANCLASS,'') + ' ' + className;
      }
      return this;
    };

  ListDOM.prototype.removeClass = classListEnabled ? function (className) {
      for( var i = 0, len = this.length; i < len ; i++ ) {
          this[i].classList.remove(className);
      }
      return this;
    } : function (className) {
      var RE_REMOVECLASS = new RegExp('(\\b|\\s+)'+className+'\\b','g');

      for( var i = 0, len = this.length; i < len ; i++ ) {
          this[i].className = this[i].className.replace(RE_REMOVECLASS,'');
      }
      return this;
    };

  ListDOM.prototype.hasClass = classListEnabled ? function (className) {
      for( var i = 0, len = this.length; i < len ; i++ ) {
          if( this[i].classList.item(className) ) {
              return true;
          }
      }
      return false;
    } : function (className) {
      var RE_HASCLASS = new RegExp('\\b' + (className || '') + '\\b','');

      for( var i = 0, len = this.length; i < len ; i++ ) {
          if( RE_HASCLASS.test(this[i].className) ) {
              return true;
          }
      }
      return false;
    };

  ListDOM.prototype.toggleClass = classListEnabled ? function (className, add) {
      var i, len;

      if( className === undefined ) {
        for( i = 0, len = this.length; i < len ; i++ ) {
          if ( this[i].classList.item(className) ) {
            this[i].classList.remove(className);
          } else {
            this[i].classList.add(className);
          }
        }
      } else if( add ) {
        for( i = 0, len = this.length; i < len ; i++ ) {
          this[i].classList.add(className);
        }
      } else {
        for( i = 0, len = this.length; i < len ; i++ ) {
          this[i].classList.remove(className);
        }
      }
      return this;
    } : function (className, add) {
      var i, len,
          RE_HASCLASS = new RegExp('\\b' + (className || '') + '\\b',''),
          RE_CLEANCLASS = new RegExp('\\b' + (className || '') + '\\b',''),
          RE_REMOVECLASS = new RegExp('(\\b|\\s+)'+className+'\\b','g');

      if( className === undefined ) {
        for( i = 0, len = this.length; i < len ; i++ ) {
          if ( RE_HASCLASS.test(this[i].className) ) {
            this[i].className = this[i].className.replace(RE_REMOVECLASS, '');
          } else {
            this[i].className = this[i].className.replace(RE_CLEANCLASS, '') + ' ' + className;
          }
        }
      } else if( add ) {
        for( i = 0, len = this.length; i < len ; i++ ) {
          this[i].className = this[i].className.replace(RE_CLEANCLASS, '') + ' ' + className;
        }
      } else {
        for( i = 0, len = this.length; i < len ; i++ ) {
          this[i].className = this[i].className.replace(RE_REMOVECLASS, '');
        }
      }
      return this;
    };

  ListDOM.prototype.parent = function () {
      var list = new ListDOM(), elem;
      for( var i = 0, len = this.length; i < len; i++ ) {
        elem = this.parentElement || this.parentNode;
        if( elem ) {
          list[list.length] = this[i];
        }
      }
    };


  
  // addFn({
  //    'render': {
  //        element: function (html) {
  //         this.innerHTML = html;
  //         this.find('script').each(function(script){
  //           var runScripts = eval;
  //           if( script.type == 'text/javascript' ) {
  //             try{ runScripts('(function(){ \'use strict\';'+script.textContent+'})();'); }catch(err){ throw err.message; }
  //           }
  //         });
          
  //         return this;
  //        },
  //        collection: function (html) {
  //           for( var i = 0, len = this.length; i < len ; i++ ) {
  //             this[i].render(html);
  //           }
  //           return this;
  //        }
  //     },
  //     'text': {
  //       element: function (text) {
  //         if( text === undefined ) {
  //           return this.textContent;
  //         } else {
  //           this.textContent = text;
  //           return this;
  //         }
  //       },
  //       collection: function (text) {
  //         var i, len;
  //           if( text === undefined ) {
  //             text = '';
  //             for( i = 0, len = this.length; i < len ; i++ ) {
  //               text += this[i].textContent;
  //             }
  //             return text;
  //           } else {
  //             for( i = 0, len = this.length; i < len ; i++ ) {
  //               this[i].textContent = text;
  //             }
  //           }
  //           return this;
  //       }
  //     },
  //     'on':{
  //         element: function (event,handler) {
  //             var elem = this;
  //             if( isString(event) ) {
  //                 if(isFunction(handler)) {
  //                     var originalHandler = handler;
  //                     handler = function(e){
  //                         originalHandler.apply(e.target,[e].concat(e.data));
  //                     };
                      
  //                     if (elem.addEventListener)  { // W3C DOM
  //                         elem.addEventListener(event,handler,false);
  //                     } else if (elem.attachEvent) { // IE DOM
  //                         elem.attachEvent("on"+event, handler);
  //                     } else throw 'No es posible añadir evento';
                      
  //                     if(!elem.listeners) elem.listeners = {};
  //                     if( !elem.listeners[event] ) elem.listeners[event] = [];
                      
  //                     elem.listeners[event].push(handler);
  //                 } else if( handler === false ) {
  //                     if(elem.listeners) {
  //                         if( elem.listeners[event] ) {
  //                             var handlers = elem.listeners[event];
  //                             handler = handlers.pop();
  //                             while( handler ) {
  //                                 if (elem.removeEventListener) elem.removeEventListener (event, handler, false);  // all browsers except IE before version 9
  //                                 else if (elem.detachEvent) elem.detachEvent ('on'+event, handler);   // IE before version 9
  //                                 handler = handlers.pop();
  //                             }
  //                         }
  //                     }
  //                 }
  //             }
              
  //             return this;
  //         },
  //         collection: function (event,handler) {
  //             Array.prototype.forEach.call(this,function(elem){
  //                 elem.on(event,handler);
  //             });
              
  //             return this;
  //         }
  //     },
  //     'off': {
  //         element: function (event) { this.on(event,false); },
  //         collection: function (event) { this.on(event,false); }
  //     },
  //     'trigger': {
  //         element: function (event,data) {
  //             triggerEvent(this, event, data);
  //         },
  //         collection: function (event,data){
  //             Array.prototype.forEach.call(this,function(elem){
  //                 triggerEvent(elem, event, data);
  //             });
  //         }
  //     },
  //     ready: {
  //       element: ready,
  //       collection: ready
  //     }
  // });

  function pushMatches( list, matches ) {
    for( i = 0, len = matches.length; i < len; i++ ) {
        list[list.length] = matches[i];
    }
    return list;
  }

  function stringMatches (selector) {
    switch ( selector[0] ) {
      case '#':
        var found = document.querySelector(selector);
        if( found ) {
          var listdom = new ListDOM();
          listdom[0] = found;
          listdom.length = 1;
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
        list[0] = selector;
        list.length = 1;
        return list;
    }

    if( selector === document ) {
      var list2 = new ListDOM();
      list2[0] = selector;
      list2.length = 1;
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

  jqlite.fn = ListDOM.prototype;

  window.ListDOM = ListDOM;

  return jqlite;
  
});