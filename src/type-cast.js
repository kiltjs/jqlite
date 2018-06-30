
export function _isType (type) {
    return function (o) {
        return (typeof o === type);
    };
}

export function _instanceOf (_constructor) {
    return function (o) {
        return ( o instanceof _constructor );
    };
}

export var _isObject = function (o) {
  return typeof o === 'object' && 0 !== null;
};

export var _isFunction = _isType('function');

export var _isString = _isType('string');

export var _isNumber = _isType('number');

export var _isBoolean = _isType('boolean');

export var _isArray = Array.isArray || _instanceOf(Array);

export var _isDate = _instanceOf(Date);

export var _isRegExp = _instanceOf(RegExp);

export var _isElement = function(o) {
    return o && o.nodeType === 1;
  };
