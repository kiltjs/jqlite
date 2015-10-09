
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
  var jqlite = factory(root);

  if( typeof module === 'object' && typeof exports === 'object' ) {
    module.exports = jqlite;
  } else {
    if ( typeof define === 'function' ) {
      define('jqlite', function () { return jqlite; } );
    } else if( typeof angular === 'function' ) {
      angular.module('jqlite', []).constant('jqlite', jqlite );
    } else {
      root.jqlite = jqlite;
    }
    if( !root.$ ) {
      root.$ = jqlite;
    }
  }

})(this, function (root, isNodejs) {
  'use strict';

  function _isType (type) {
      return function (o) {
          return (typeof o === type);
      };
  }

  function _instanceOf (_constructor) {
      return function (o) {
          return ( o instanceof _constructor );
      };
  }

	var _isObject = _isType('object'),
			_isFunction = _isType('function'),
			_isString = _isType('string'),
			_isNumber = _isType('number'),
			_isArray = Array.isArray || _instanceOf(Array),
			_isDate = _instanceOf(Date),
			_isRegExp = _instanceOf(RegExp),
			_isElement = function(o) {
		    return o && o.nodeType === 1;
		  },
      _find = function (list, iteratee) {
        if( !( iteratee instanceof Function ) ) {
          var value = iteratee;
          iteratee = function (item) {
            return item === value;
          };
        }

        for( var i = 0, n = list.length ; i < n ; i++ ) {
          if( iteratee(list[i]) ) {
            return {
              index: i,
              found: list[i]
            };
          }
        }

        return {
          index: -1
        };
      };

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

  var triggerEvent = document.createEvent ? function (element, eventName, args, data) {
      var event = document.createEvent("HTMLEvents");
      event.data = data;
      event.args = args;
      event.initEvent(eventName, true, true);
      element.dispatchEvent(event);
      return event;
    } : function (element, eventName, args, data) {
      var event = document.createEventObject();
      event.data = data;
      event.args = args;
      element.fireEvent("on" + eventName, event);
      return event;
    };

  var RE_HAS_SPACES = /\s/,
      RE_ONLY_LETTERS = /^[a-zA-Z]+$/,
      RE_IS_ID = /^\#[^\.\[]/,
      RE_IS_CLASS = /^\.[^#\[]/,
      runScripts = eval,
      noop = function noop () {},
      auxArray = [],
      auxDiv = document.createElement('div'),
      detached = document.createElement('div'),
      classListEnabled = !!auxDiv.classList;

  // Events support

  var attachElementListener = noop,
      detachElementListener = noop,
      onceListeners = [];

  if( auxDiv.addEventListener )  { // W3C DOM

    attachElementListener = function (element, eventName, listener) {
      listener.$listener = function(e){
          listener.apply(element, [e].concat(e.args) );
      };

      element.addEventListener(eventName, listener.$listener,false);
    };

    detachElementListener = function (element, eventName, listener) {
      element.removeEventListener(eventName, listener.$listener || listener, false);

      var _listener = _find(onceListeners, function (listenerData) {
        return listenerData.listener === listener && listenerData.element === element;
      });

      if( _listener.found ) {
        onceListeners.splice(_listener.index, 1);
        detachElementListener(element, eventName, _listener.found._listener);
      }
    };


  } else if(document.body.attachEvent) { // IE DOM

    attachElementListener = function (element, eventName, listener) {
      listener.$listener = function(e){
          listener.apply(element,[e].concat(e.args));
      };

      element.attachEvent("on" + eventName, listener.$listener, false);
    };

    detachElementListener = function (element, eventName, listener) {
      element.detachEvent('on' + eventName, listener.$listener || listener );
    };

  } else {
    throw 'Browser not compatible with element events';
  }

  // jqlite function

  function pushMatches( list, matches ) {
    for( var i = 0, len = matches.length; i < len; i++ ) {
        list[i] = matches[i];
    }
    list.length += len;
    return list;
  }

  var RE_TAG = /^[a-z-_]$/i;

  function stringMatches (selector, element) {
    var char0 = selector[0];

    if( char0 === '<') {
      auxDiv.innerHTML = selector;
      var jChildren = pushMatches( new ListDOM(), auxDiv.children );
      return jChildren;
    } else if ( selector.indexOf(' ') !== -1 || selector.indexOf(':') !== -1 ) {
      return pushMatches( new ListDOM(), element.querySelectorAll(selector) );
    } else if( char0 === '#' ) {
      var found = element.getElementById(selector.substr(1));
      if( found ) {
        var listdom = new ListDOM();
        listdom[0] = found;
        listdom.length = 1;
        return listdom;
      } else {
        return pushMatches( new ListDOM(), element.querySelectorAll(selector) );
      }
    } else if( char0 === '.' ) {
      return pushMatches( new ListDOM(), element.getElementsByClassName(selector.substr(1)) );
    } else if( RE_TAG.test(selector) ) {
      // console.log(document.getElementsByTagName(selector), element.getElementsByTagName(selector).length);
      return pushMatches( new ListDOM(), element.getElementsByTagName(selector) );
    }
    return pushMatches( new ListDOM(), element.querySelectorAll(selector) );
  }

  function initList(selector) {

    if( selector instanceof ListDOM ) {
      return selector;
    } else if( _isArray(selector) || selector instanceof NodeList || selector instanceof HTMLCollection ) {
      return pushMatches( new ListDOM(), selector );
    } else if( selector === window || selector === document || selector instanceof HTMLElement || selector instanceof Element || _isElement(selector) ) {
      var list2 = new ListDOM();
      list2[0] = selector;
      list2.length = 1;
      return list2;

    } else if( _isFunction(selector) ) {
      ready(selector);
    } else if( selector === undefined ) {
      return new ListDOM();
    }
  }

  function jqlite (selector, element){
    if( _isString(selector) ) {
      return stringMatches(selector, element || document );
    }
    return initList(selector);
  }

  jqlite.noop = noop;

  // document ready

  var _onLoad = window.addEventListener ? function (listener) {
    window.addEventListener('load', listener, false);
  } : function (listener) {
    window.attachEvent('onload', listener );
  };

  function ready (callback) {
    if( _isFunction(callback) ) {
      if (/loaded|complete/.test(document.readyState)) {
        callback();
      } else {
        _onLoad(callback);
      }
    }
  }

  // ListDOM

  function ListDOM(){}

  ListDOM.prototype = [];
  ListDOM.prototype.ready = ready;

  jqlite.fn = ListDOM.prototype;

  ListDOM.prototype.get = function(pos) {
      return pos ? this[pos] : this;
    };

  ListDOM.prototype.eq = function(pos) {
      if( !_isNumber(pos) ) {
        throw 'number required';
      }
      var item = ( pos < 0 ) ? this[this.length - pos] : this[pos], list = new ListDOM();

      if(item) {
        list[0] = item;
        list.length = 1;
      }
      return list;
    };

  ListDOM.prototype.first = function() {
      var list = new ListDOM();

      if( this.length ) {
        list[0] = this[0];
        list.length = 1;
      }
      return list;
    };

  ListDOM.prototype.last = function() {
      var list = new ListDOM();

      if( this.length ) {
        list[0] = this[this.length - 1];
        list.length = 1;
      }
      return list;
    };

  ListDOM.prototype.find = function(selector) {
      var list = this, elems = new ListDOM(), found, i, len;

      if( /^\s*>/.test(selector) ) {
        selector = selector.replace(/^\s*>\s*([^\s]*)\s*/, function (match, selector2) {
          list = list.children(selector2);
          return '';
        });

        if( !selector ) {
          return list;
        }
      }

      if( list.length === 1 ) {
        found = list[0].querySelectorAll(selector);
        for( i = 0, len = found.length; i < len; i++ ) {
          elems[i] = found[i];
        }
        elems.length = len;
      } else if( list.length > 1 ) {
        var j, len2;
        for( i = 0, len = list.length; i < len; i++ ) {
            found = list[i].querySelectorAll(selector);
            for( j = 0, len2 = found.length; j < len2 ; j++ ) {
                if( !found.item(j).___found___ ) {
                    elems[elems.length] = found.item(j);
                    elems.length++;
                    found.item(j).___found___ = true;
                }
            }
        }
        for( i = 0, len = elems.length; i < len ; i++ ) {
          delete elems[i].___found___;
        }
      }

      return elems;
    };


  ListDOM.prototype.$ = ListDOM.prototype.find;

  ListDOM.prototype.add = function (selector, element) {
    var el2add = jqlite(selector, element), i, j, len,
        list = new ListDOM(), listLength = this.length;

    for( i = 0, len = this.length; i < len ; i++ ) {
      list[i] = this[i];
      list[i].___found___ = true;
    }

    for( i = 0, len = el2add.length; i < len ; i++ ) {
      if( !el2add[i].___found___ ) {
        list[listLength] = el2add[i];
        listLength++;
      }
    }

    list.length = listLength;

    for( i = 0, len = this.length; i < len ; i++ ) {
      delete list[i].___found___;
    }

    return list;

  };

  ListDOM.prototype.each = function(each) {
      if( _isFunction(each) ) {
        for( var i = 0, len = this.length, elem; i < len ; i++ ) {
          each.call(this[i], i, this[i]);
        }
      }
      return this;
    };

  ListDOM.prototype.empty = function() {
      for( var i = 0, len = this.length, elem, child; i < len ; i++ ) {
          elem = this[i];
          child = elem.firstChild;
          while( child ) {
            elem.removeChild(child);
            child = elem.firstChild;
          }
      }
      return this;
    };

  ListDOM.prototype.filter = function(selector) {
      var elems = new ListDOM(), elem, i, len;

      if( _isFunction(selector) ) {
        for( i = 0, len = this.length, elem; i < len ; i++ ) {
          elem = this[i];
          if( selector.call(elem, i, elem) ) {
            elems.push(elem);
          }
        }
      } else if( _isString(selector) ) {
          for( i = 0, len = this.length, elem; i < len ; i++ ) {
            elem = this[i];
            if( Element.prototype.matchesSelector.call(elem,selector) ) {
              elems.push(elem);
            }
          }
      }
      return elems;
    };

  ListDOM.prototype.closest = function(selector) {
      var elems = new ListDOM(), i, len, elem;

      if( !selector ) {
        return this;
      }

      if( this.length === 1 ) {

        elem = this[0].parentElement;

        while( elem ) {
          if( elem.matchesSelector(selector) ) {
            elems.push(elem);
            break;
          }
          elem = elem.parentElement;
        }

      } else if( this.length > 1 ) {

        var j, len2;

        for( i = 0, len = this.length; i < len; i++ ) {

          elem = this[i].parentElement;
          while( elem ) {
            if( elem.matchesSelector(selector) ) {
              if( !elem.___found___ ) {
                elem.___found___ = true;
                elems.push(elem);
              }
              break;
            }
            elem = elem.parentElement;
          }
        }
        for( i = 0, len = elems.length; i < len ; i++ ) {
          delete elems[i].___found___;
        }
      }

      return elems;
    };

  ListDOM.prototype.children = auxDiv.children ? function (selector){
      var elems = new ListDOM();

      for( var i = 0, len = this.length; i < len; i++ ) {
        pushMatches(elems, this[i].children);
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

  ListDOM.prototype.contents = function (selector) {
      var elems = new ListDOM(), elem;

      Array.prototype.forEach.call(this,function(elem){
        elem = elem.firstChild;
        while(elem) {
          elems[elems.length] = elem;
          elem = elem.nextSibling;
        }
      });

      if( selector ) {
        return elems.filter(selector);
      }
      return elems;
    };

    // function _cloneEvents(nodeSrc, nodeDest) {
    //   console.log('getEventListeners', getEventListeners);
    //   var events = getEventListeners(nodeSrc),
    //       e, i, len;

    //   for( e in events ) {
    //     for( i = 0, len = events[e].length; i < len ; i++ ) {
    //       nodeDest.addEventListener(e, events[e][i].listener, events[e][i].useCapture);
    //     }
    //   }
    // }

  ListDOM.prototype.clone = function (deep, cloneEvents) {
    var list = new ListDOM(), i, len;

    if( deep === undefined ) {
      deep = true;
    }

    for( i = 0, len = this.length; i < len ; i++ ) {
      list[i] = this[i].cloneNode(deep);

      // if(cloneEvents) {
      //   _cloneEvents(this[i], list[i]);
      // }
    }

    list.length = len;

    return list;
  };

  ListDOM.prototype.data = function (key, value) {
      if( !this.length ) {
        return value ? this : undefined;
      }

      if( value === undefined ) {
        var data = this[0].$$jqliteData && this[0].$$jqliteData[key];
        if( data === undefined ) {
          data = this.dataset(key);
          if( data === undefined ) {
            return undefined;
          } else if( data.charAt(0) === '{' || data.charAt(0) === '[' ) {
            return JSON.parse(data);
          } else if( /^\d+$/.test(data) ) {
            return Number(data);
          } else {
            return data;
          }
        }
        return data;
      }

      for( var i = 0, n = this.length; i < n ; i++ ) {
        this[i].$$jqliteData = this[i].$$jqliteData || {};
        this[i].$$jqliteData[key] = value;
      }
    };

  ListDOM.prototype.removeData = function (key) {
      for( var i = 0, n = this.length ; i < n ; i++ ) {
        if( this[i].$$jqliteData && this[i].$$jqliteData[key] ) {
          delete this[i].$$jqliteData[key];
        }
      }
      return this;
    };

  ListDOM.prototype.dataset = auxDiv.dataset ? function (key, value) {
      var i, len;

      if( value === undefined ) {
        if( key === undefined ) {
          return this[0] ? this[0].dataset : {};
        } else {
          return ( this[0] || {} ).dataset[key];
        }
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

  ListDOM.prototype.removeDataset = auxDiv.dataset ? function (key) {
      var i, len;
      if( typeof key === 'string' ) {
        for( i = 0, len = this.length; i < len ; i++ ) {
          delete this[i].dataset[key];
        }
      } else if( _isArray(key) ) {
        for( i = 0, len = key.length; i < len ; i++ ) {
          this.removeData(key[i]);
        }
      }
      return this;
    } : function (key) {
      var i, len;
      if( typeof key === 'string' ) {
        for( i = 0, len = this.length; i < len ; i++ ) {
          this[i].removeAttribute('data-' + key);
        }
      } else if( _isArray(key) ) {
        for( i = 0, len = key.length; i < len ; i++ ) {
          this.removeData(key[i]);
        }
      }
      return this;
    };

  ListDOM.prototype.attr = function (key, value) {
      var i, len;
      if( _isFunction(value) ) {
        for( i = 0, len = this.length; i < len ; i++ ) {
          this[i].setAttribute( key, value(i, this[i].getAttribute(key) ) );
        }
      } else if( value !== undefined ) {
        for( i = 0, len = this.length; i < len ; i++ ) {
          this[i].setAttribute(key,value);
        }
      } else if( this[0] ) {
        return this[0].getAttribute( key );
      }
      return this;
    };

  ListDOM.prototype.removeAttr = function (key) {
      for( var i = 0, len = this.length; i < len ; i++ ) {
        this[i].removeAttribute(key);
      }
      return this;
    };

  ListDOM.prototype.prop = function (key, value) {
      var i, len;

      if( _isFunction(value) ) {
        for( i = 0, len = this.length; i < len ; i++ ) {
          this[i][key] = value( i, this[i][key] );
        }
      } else if( value !== undefined ) {
        for( i = 0, len = this.length; i < len ; i++ ) {
          this[i][key] = value;
        }
      } else if( this[0] ) {
        return this[0][key];
      }
      return this;
    };

  ListDOM.prototype.val = function (value) {
      var element;
      if( value === undefined ) {
        element = this[0];
        if( element.nodeName === 'select' ) {
          return element.options[element.selectedIndex].value;
        } else {
          return ( this[0].value || this[0].getAttribute('value') );
        }
      } else {
        for( var i = 0, len = this.length; i < len ; i++ ) {
          if( this[i].nodeName === 'select' ) {
            element = this[i];
            for( var j = 0, len2 = element.options.length; j < len2 ; j++ ) {
              if( element.options[j].value === value ) {
                element.options[j].selected = true;
                break;
              }
            }
          } else if (this[i].value !== undefined) {
            this[i].value = value;
          } else {
            this[i].setAttribute('value', value);
          }
        }
      }
      return this;
    };

  ListDOM.prototype.addClass = classListEnabled ? function (className) {
      if( className.indexOf(' ') >= 0 ) {
        var _this = this;
        className.split(' ').forEach(function (cn) {
          _this.addClass(cn);
        });
      } else {
        for( var i = 0, len = this.length; i < len ; i++ ) {
            this[i].classList.add(className);
        }
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
      if( className.indexOf(' ') >= 0 ) {
        var jThis = $(this);
        className.split(' ').forEach(function (cn) {
          jThis.removeClass(cn);
        });
      } else {
        for( var i = 0, len = this.length; i < len ; i++ ) {
            this[i].classList.remove(className);
        }
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
          if( this[i].classList.contains(className) ) {
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

  ListDOM.prototype.append = function (content) {
      var jContent = $(content), jContent2, i, j, len, len2, element;

      jContent.remove();

      for( i = 0, len = this.length; i < len; i++ ) {
        jContent2 = ( i ? jContent.clone(true) : jContent );
        element = this[i];
        for( j = 0, len2 = jContent2.length; j < len2; j++ ) {
          element.appendChild(jContent2[j]);
        }
      }

      return this;
    };

  ListDOM.prototype.appendTo = function (target) {
      $(target).append(this);
    };

  ListDOM.prototype.prepend = function (content) {
      var jContent = $(content), jContent2, i, j, len, len2, element, previous;

      jContent.remove();

      for( i = 0, len = this.length; i < len; i++ ) {
        jContent2 = ( i ? jContent.clone(true) : jContent );
        element = this[i];
        previous = element.firstChild;

        if( previous ) {
          for( j = 0, len2 = jContent2.length; j < len2; j++ ) {
            element.insertBefore(jContent2[j], previous);
          }
        } else {
          for( j = 0, len2 = jContent2.length; j < len2; j++ ) {
            element.appendChild(jContent2[j]);
          }
        }

      }

      return this;
    };

  ListDOM.prototype.after = function (content) {
      var jContent = $(content), jContent2, i, j, len, len2, element, parent;

      jContent.remove();

      for( i = 0, len = this.length; i < len; i++ ) {
        jContent2 = ( i ? jContent.clone(true) : jContent );
        parent = this[i].parentElement || this[i].parentNode;
        element = this[i].nextElementSibling || this[i].nextSibling;
        if( element ) {
          for( j = 0, len2 = jContent2.length; j < len2; j++ ) {
            parent.insertBefore(jContent2[j], element);
            element = jContent2[j];
          }
        } else {
          for( j = 0, len2 = jContent2.length; j < len2; j++ ) {
            parent.appendChild(jContent2[j]);
          }
        }
      }

      return this;
    };

  ListDOM.prototype.replaceWith = function (content) {
      var jContent = $(content), jContent2, i, j, len, len2, element, parent, next;

      jContent.remove();

      for( i = 0, len = this.length; i < len; i++ ) {
        jContent2 = ( i ? jContent.clone(true) : jContent );
        element = this[i];
        parent = element.parentElement || parentNode;

        parent.replaceChild(jContent2[0], element);

        if( jContent2[1] ) {
          next = jContent2[0];
          for( j = 1, len2 = jContent2.length; j < len2; j++ ) {
            parent.insertBefore(jContent2[j], next);
          }
        }

      }

      return this;
    };

  ListDOM.prototype.wrap = function (content) {
      var jContent = $(content), jContent2, i, j, len, len2, element, parent;

      jContent.remove();

      for( i = 0, len = this.length; i < len; i++ ) {
        jContent2 = ( i ? jContent.clone(true) : jContent );
        parent = this[i].parentElement || this[i].parentNode;
        element = this[i].nextElementSibling || this[i].nextSibling;
        if( element ) {
          for( j = 0, len2 = jContent2.length; j < len2; j++ ) {
            parent.insertBefore(jContent2[j], element);
            element = jContent2[j];
          }
        } else {
          for( j = 0, len2 = jContent2.length; j < len2; j++ ) {
            parent.appendChild(jContent2[j]);
          }
        }

        if( jContent2[0] ) {
          element = jContent2[0];
          while( element.firstElementChild ) {
            element = element.firstElementChild;
          }
          element.appendChild(this[i]);
        }
      }

      return this;
    };

  function filterDuplicated (list) {
    var filteredList = list.filter(function (node) {
      if( node.___found___ ) {
        return false;
      }
      node.___found___ = true;
      return true;
    });
    filteredList.forEach(function (node) {
      delete node.___found___;
    });
    return filteredList;
  }

  ListDOM.prototype.next = function (selector) {
      var list = new ListDOM(), elem;

      for( var i = 0, len = this.length; i < len; i++ ) {
        elem = this[i].nextElementSibling;
        if( elem ) {
          list.push(elem);
        }
      }

      return ( typeof selector === 'string' ) ? list.filter(selector): list;
    };

  ListDOM.prototype.nextAll = function (selector) {
      var list = new ListDOM(), elem;

      for( var i = 0, len = this.length; i < len; i++ ) {
        elem = this[i].nextElementSibling;
        while( elem ) {
          list.push(elem);
          elem = elem.nextElementSibling;
        }
      }

      return filterDuplicated( ( typeof selector === 'string' ) ? list.filter(selector): list );
    };

  ListDOM.prototype.prev = function (selector) {
      var list = new ListDOM(), elem;

      for( var i = 0, len = this.length; i < len; i++ ) {
        elem = this[i].previousElementSibling;
        if( elem ) {
          list.push(elem);
        }
      }

      return ( typeof selector === 'string' ) ? list.filter(selector): list;
    };

  ListDOM.prototype.prevAll = function (selector) {
      var list = new ListDOM(), elem;

      for( var i = 0, len = this.length; i < len; i++ ) {
        elem = this[i].previousElementSibling;
        while( elem ) {
          list.push(elem);
          elem = elem.previousElementSibling;
        }
      }

      return filterDuplicated( ( typeof selector === 'string' ) ? list.filter(selector): list );
    };

  ListDOM.prototype.parent = function (selector) {
      var list = new ListDOM(), elem;

      for( var i = 0, len = this.length; i < len; i++ ) {
        elem = this.parentElement || this.parentNode;
        if( elem ) {
          list.push(this[i]);
        }
      }

      return ( typeof selector === 'string' ) ? list.filter(selector): list;
    };

  ListDOM.prototype.remove = function (selector) {
      var list = selector ? this.filter(selector) : this, parent;

      for( var i = 0, len = list.length; i < len; i++ ) {
        parent = list[i].parentElement || list[i].parentNode;
        if( parent ) {
          parent.removeChild(list[i]);
        }
      }

      return this;
    };

  ListDOM.prototype.detach = function (selector) {
      var list = selector ? this.filter(selector) : this,
          elems = new ListDOM();

      for( var i = 0, len = list.length; i < len; i++ ) {
        detached.appendChild(list[i]);
        elems.push(list[i]);
      }

      return elems;
    };

  ListDOM.prototype.css = function (key, value) {

      if( value !== undefined ) {
        var i, len;
        value = ( value instanceof Function ) ? value() : ( value instanceof Number ? (value + 'px') : value );

        if( typeof value === 'string' && /^\+=|\-=/.test(value) ) {
          value = ( value.charAt(0) === '-' ) ? -parseFloat(value.substr(2)) : parseFloat(value.substr(2));

          for( i = 0, len = this.length; i < len; i++ ) {
            this[i].style[key] = parseFloat(this[i].style[key]) + value + 'px';
          }
        } else {
          for( i = 0, len = this.length; i < len; i++ ) {
            this[i].style[key] = value;
          }
        }
        return this;
      } else if( key instanceof Object ) {
        for( var k in key ) {
          this.css(k, key[k]);
        }
      } else if( this[0] ) {
        return this[0].style[key] || window.getComputedStyle(this[0])[key];
      }

      return this;
    };

  var transitionKey = auxDiv.style.webkitTransition !== undefined ? 'webkitTransition' : (
    auxDiv.style.mozTransition !== undefined ? 'mozTransition' : (
      auxDiv.style.msTransition !== undefined ? 'msTransition' : undefined
    )
  );

  function animateFade (list, show, time, timingFunction, callback) {
    if( typeof time === 'string' ) {
      time = animateFade.times[time];
    }

    timingFunction = timingFunction || 'linear';
    var opacityStart = show ? 0 : 1,
        opacityEnd = show ? 1 : 0;

    for( var i = 0, n = list.length; i < n ; i++ ) {
      list[i].style.opacity = opacityStart;
    }
    setTimeout(function () {
      for( var i = 0, n = list.length; i < n ; i++ ) {
        list[i].$$jqliteTransition = list[i].$$jqliteTransition === undefined ? ( list[i].style[transitionKey] || '' ) : list[i].$$jqliteTransition;
        list[i].style[transitionKey] = 'opacity ' + time + 'ms ' + timingFunction;
        list[i].style.opacity = opacityEnd;
      }
    }, 20);

    setTimeout(function () {
      for( var i = 0, n = list.length; i < n ; i++ ) {
        list[i].style.opacity = '';
        list[i].style[transitionKey] = list[i].$$jqliteTransition;
      }
      callback.call(list);
    }, time);

    return list;
  }

  animateFade.times = {
    slow: 600,
    normal: 400,
    fast: 200
  };

  ListDOM.prototype.show = function (time, easing, callback) {
    if( time ) {
      var list = this;
      this.show();
      return animateFade(list, true, time, easing, callback || function () {});
    }

    for( var i = 0, n = this.length; i < n ; i++ ) {
      if( this[i].style.display ) {
        this[i].style.display = '';
      }
    }
    return this;
  };

  ListDOM.prototype.hide = function (time, easing, callback) {
    if( time ) {
      return animateFade(this, false, time, easing, function () {
        this.hide();
        if( callback ) {
          callback.call(this);
        }
      });
    }

    for( var i = 0, n = this.length; i < n ; i++ ) {
      this[i].style.display = 'none';
    }
    return this;
  };

  ListDOM.prototype.position = function () {
    if( this.length ) {
      return {
        top: this[0].offsetTop,
        left: this[0].offsetLeft
      };
    }
  };

  ListDOM.prototype.offset = function (coordinates) {
    if( coordinates === undefined ) {
      var rect = this[0].getBoundingClientRect();
      return this.length && { top: rect.top + document.body.scrollTop, left: rect.left };
    }
    if( coordinates instanceof Function ) {
      coordinates = coordinates();
    }
    if( typeof coordinates === 'object' ) {
      if( coordinates.top !== undefined && coordinates.left !== undefined ) {
        for( var i = 0, len = this.length, position ; i < len ; i++ ) {
          // position = this[i].style.position || window.getComputedStyle(this[i]).position;
          this[i].style.position = 'relative';

          var p = this[i].getBoundingClientRect();

          this[i].style.top = coordinates.top - p.top + parseFloat(this[i].style.top || 0) - document.body.scrollTop + 'px';
          this[i].style.left = coordinates.left - p.left + parseFloat(this[i].style.left || 0) + 'px';
        }
        return coordinates;
      }
    }
  };

  ListDOM.prototype.width = function (value, offset) {
    var el;
    if( value === true ) {
      if( this.length ) {
        el = this[0];
        return el.offsetWidth;
      }
    } else if( value !== undefined ) {

      for( var i = 0, len = this.length; i< len ; i++ ) {
        this[i].style.width = value;
      }

    } else if( this.length ) {
      el = this[0];
      return el.offsetWidth -
        parseFloat( window.getComputedStyle(el, null).getPropertyValue('border-left-width') ) -
        parseFloat( window.getComputedStyle(el, null).getPropertyValue('padding-left') ) -
        parseFloat( window.getComputedStyle(el, null).getPropertyValue('padding-right') ) -
        parseFloat( window.getComputedStyle(el, null).getPropertyValue('border-right-width') );
    }
  };

  ListDOM.prototype.height = function (value, offset) {
    var el;
    if( value === true ) {
      if( this.length ) {
        el = this[0];
        return el.offsetHeight;
      }
    } else if( value !== undefined ) {

      for( var i = 0, len = this.length; i < len ; i++ ) {
        this[i].style.height = value;
      }

    } else if( this.length ) {
      el = this[0];
      return el.offsetHeight -
        parseFloat( window.getComputedStyle(el, null).getPropertyValue('border-top-width') ) -
        parseFloat( window.getComputedStyle(el, null).getPropertyValue('padding-top') ) -
        parseFloat( window.getComputedStyle(el, null).getPropertyValue('padding-bottom') ) -
        parseFloat( window.getComputedStyle(el, null).getPropertyValue('border-bottom-width') );
    }
  };

  ListDOM.prototype.html = function (html) {
      var i, len;
      if( html === undefined ) {
        html = '';
        for( i = 0, len = this.length; i < len; i++ ) {
          text += this[i].innerHTML;
        }
        return this;
      } else if( html === true ) {
        html = '';
        for( i = 0, len = this.length; i < len; i++ ) {
          text += this[i].outerHTML;
        }
        return this;
      } else {
        if( _isFunction(html) ) {
          for( i = 0, len = this.length; i < len; i++ ) {
            this[i].innerHTML = html(i, this[i].innerHTML);
          }
          return this;
        } else {
          for( i = 0, len = this.length; i < len; i++ ) {
            this[i].innerHTML = html;
          }
        }
        this.find('script').each(function(){
          if( (this.type == 'text/javascript' || !this.type) && this.textContent ) {
            try{
              runScripts('(function(){ \'use strict\';' + this.textContent + '})();');
            } catch(err) {
              throw new Error(err.message);
            }
          }
        });
      }
      return this;
    };

  ListDOM.prototype.text = function (text) {
      var i, len;
      if( text === undefined ) {
        text = '';
        for( i = 0, len = this.length; i < len; i++ ) {
          text += this[i].textContent;
        }
        return text;
      } else if( _isFunction(text) ) {
        for( i = 0, len = this.length; i < len; i++ ) {
          this[i].textContent = text(i, this[i].textContent);
        }
        return this;
      } else {
        for( i = 0, len = this.length; i < len; i++ ) {
          this[i].textContent = text;
        }
        return this;
      }
    };

  ListDOM.prototype.on = function (eventName, listener) {
    var i, len;

    if( typeof eventName === 'string' ) {

      if( /\s/.test(eventName) ) {
        eventName = eventName.split(/\s+/g);
      } else {
        if( !_isFunction(listener) ) {
          throw 'listener needs to be a function';
        }

        for( i = 0, len = this.length; i < len; i++ ) {
          attachElementListener(this[i], eventName, listener);
        }
      }
    }

    if( _isArray(eventName) ) {
      for( i = 0, len = eventName.length; i < len; i++ ) {
        this.on(eventName[i], listener);
      }
    } else if( _isObject(eventName) ) {
      for( i in eventName ) {
        this.on(i, eventName[i]);
      }
    }

    return this;
  };

  var eventActions = {
    list: ['click', 'focus', 'blur', 'submit'],
    define: function (name) {
      ListDOM.prototype[name] = function (listener) {
        if( listener ) {
          this.on(name, listener);
        } else {
          for( var i = 0, len = this.length; i < len; i++ ) {
            this[i][name]();
          }
        }
        return this;
      };
    },
    init: function () {
      for( var i = 0, len = eventActions.list.length, name; i < len; i++ ) {
        eventActions.define(eventActions.list[i]);
      }
    }
  };
  eventActions.init();

  function autoDestroyListener (element, eventName, listener) {
    var listenerData = {
          listener: listener,
          element: element
        },
        _listener = function () {
          detachElementListener(element, eventName, _listener);
          listener.apply(null, arguments);

          var index = onceListeners.indexOf(listenerData);
          if( index >= 0 ) {
            onceListeners.splice(index, 1);
          }
        };

    listenerData._listener = _listener;

    onceListeners.push(listenerData);

    return _listener;
  }

  ListDOM.prototype.once = function (eventName, listener) {

    var i, len;

    if( typeof eventName === 'string' ) {

      if( /\s/.test(eventName) ) {
        eventName = eventName.split(/\s+/g);
      } else {
        if( !_isFunction(listener) ) {
          throw 'listener needs to be a function';
        }

        var element;

        for( i = 0, len = this.length; i < len; i++ ) {
          element = this[i];
          attachElementListener(element, eventName, autoDestroyListener(element, eventName, listener) );
        }
      }
    }

    if( _isArray(eventName) ) {
      for( i = 0, len = eventName.length; i < len; i++ ) {
        this.once(eventName[i], listener);
      }
    } else if( _isObject(eventName) ) {
      for( i in eventName ) {
        this.once(i, eventName[i]);
      }
    }

    return this;
  };
  // for jQuery compatibility
  ListDOM.prototype.one = ListDOM.prototype.once;

  ListDOM.prototype.off = function (eventName, listener) {
    var i, n;

    if( /\s/.test(eventName) ) {
      eventName = eventName.split(/\s+/g);
    }

    if( eventName instanceof Array ) {
      for( i = 0, n = this.length; i < n; i++ ) {
        this.off(eventName[i], listener);
      }
      return this;
    }

    if( typeof eventName !== 'string' || !_isFunction(listener) ) {
      throw 'bad arguments';
    }

    for( i = 0, n = this.length; i < n; i++ ) {
      detachElementListener(this[i], eventName, listener);
    }
    return this;
  };

  ListDOM.prototype.trigger = function (eventName, args, data) {
    if( typeof eventName !== 'string' ) {
      throw 'bad arguments';
    }

    for( var i = 0, len = this.length; i < len; i++ ) {
      triggerEvent(this[i], eventName, args, data);
    }
    return this;
  };

  ListDOM.prototype.stopPropagation = function () {
    for( var i = 0, len = arguments.length; i < len; i++ ) {
      this.on(arguments[i], function (e) {
        e.stopPropagation();
      });
    }
  };

  // shorthands

  ['mouseenter', 'mouseleave'].forEach(function (eventName) {
    ListDOM.prototype[eventName] = function (handler) {
      this.on(eventName, handler);
      return this;
    };
  });

  ListDOM.prototype.hover = function (mouseIn, mouseOut) {
    return this.mouseenter(mouseIn).mouseleave(mouseOut);
  };

  // finally

  return jqlite;

});
