
import {_isArray, _isObject} from './type-cast';

export function find (list, iteratee, this_arg) {
  if( !( iteratee instanceof Function ) ) {
    var value = iteratee;
    iteratee = function (item) {
      return item === value;
    };
  }

  for( var i = 0, n = list.length ; i < n ; i++ ) {
    if( iteratee.call(this_arg, list[i]) ) {
      return {
        index: i,
        found: list[i]
      };
    }
  }

  return {
    index: -1
  };
}

var arrayShift = Array.prototype.shift;

export function _merge () {
  var dest = arrayShift.call(arguments),
      src = arrayShift.call(arguments),
      key;

  while( src ) {

    if( typeof dest !== typeof src ) {
      dest = _isArray(src) ? [] : ( _isObject(src) ? {} : src );
    }

    if( _isObject(src) ) {

      for( key in src ) {
        if( src[key] !== undefined ) {
          if( typeof dest[key] !== typeof src[key] ) {
              dest[key] = _merge(undefined, src[key]);
          } else if( _isArray(dest[key]) ) {
              [].push.apply(dest[key], src[key]);
          } else if( _isObject(dest[key]) ) {
              dest[key] = _merge(dest[key], src[key]);
          } else {
              dest[key] = src[key];
          }
        }
      }
    }
    src = arrayShift.call(arguments);
  }

  return dest;
}

export function _extend () {
  var dest = arrayShift.call(arguments),
      src = arrayShift.call(arguments),
      key;

  while( src ) {
    for( key in src) {
      dest[key] = src[key];
    }
    src = arrayShift.call(arguments);
  }

  return dest;
}
