jEngine: jqlite [![](https://img.shields.io/npm/v/jqlite.svg)](https://www.npmjs.com/package/jqlite) [![](https://img.shields.io/bower/v/jengine-jqlite.svg)](http://bower.io/search/?q=jengine-jqlite) [![](https://img.shields.io/npm/dm/jqlite.svg)](https://www.npmjs.com/package/jqlite)
==============================
wercker: [![wercker status](https://app.wercker.com/status/f436d6c59cd7ef60ac2aa2ff49ed8f7b/s "wercker status")](https://app.wercker.com/project/bykey/f436d6c59cd7ef60ac2aa2ff49ed8f7b)
travis: [![Build Status](https://travis-ci.org/jstools/jqlite.svg?branch=master)](https://travis-ci.org/jstools/jqlite)

> Tiny JavaScript DOM query library

-----------

## Installation

```.sh
npm install jqlite --save
```
  or
```.sh
bower install jstools-jqlite --save
```
-----------

## Main Object

> jqlite object ($)

``` js

  // starting by '<' returns a collection of DOM nodes from this code
  // result: [<HTMLElement>]
  $('<div class="foo">bar</div>');

  // also accepts several objects at root level
  // result: [<HTMLElement>, <HTMLElement>]
  $('<div class="foo">bar</div><div class="bar">foo</div>');

  // jqlite selectors returns collection by accepting pure css selectors
  // jQuery uses sizzlejs to parse selectors
  $('#some-id');
  $('.some-class');
  $('#wrapper .item');
```

## Methods

### get(position) ( [api.jquery.com/get](http://api.jquery.com/get/) )

``` html
<div class="item-1"></div>
<div class="item-2"></div>
<div class="item-3"></div>
<div class="item-4"></div>
<div class="item-5"></div>
```
``` js
  $('div').get(3)
  // returns <div class="item-4"></div>
```
returns the element in given `position`

### eq(position) ( [api.jquery.com/eq](http://api.jquery.com/eq/) )

``` html
<div class="item-1"></div>
<div class="item-2"></div>
<div class="item-3"></div>
<div class="item-4"></div>
<div class="item-5"></div>
```
``` js
  $('div').eq(3)
  // returns [<div class="item-4"></div>]
```
returns a collection with only one element, specified by `position`, if is lower than 0 it will count backwards from the last element

### first() ( [api.jquery.com/first](http://api.jquery.com/first/) )

``` html
<div class="item-1"></div>
<div class="item-2"></div>
<div class="item-3"></div>
<div class="item-4"></div>
<div class="item-5"></div>
```
``` js
  $('div').first()
  // returns [<div class="item-1"></div>]
```
returns a collection with only the last element

### last() ( [api.jquery.com/last](http://api.jquery.com/last/) )

``` html
<div class="item-1"></div>
<div class="item-2"></div>
<div class="item-3"></div>
<div class="item-4"></div>
<div class="item-5"></div>
```
``` js
  $('div').last()
  // returns [<div class="item-5"></div>]
```
returns a collection with only the last element

### find(selector) ( [api.jquery.com/find](http://api.jquery.com/find/) )

``` html
<ul>
  <li class="foo item-1"></li>
  <li class="bar item-2"></li>
  <li class="foo item-3"></li>
  <li class="bar item-4"></li>
  <li class="foo item-5"></li>
</ul>
```
``` js
  $('ul').find('.foo')
  // returns [
  //  <li class="foo item-1"></li>
  //  <li class="foo item-3"></li>
  //  <li class="foo item-5"></li>
```
returns a collection with elements that matches the `selector` from the given collection

- [x] [`addClass()`](http://api.jquery.com/addClass/)
- [x] [`removeClass()`](http://api.jquery.com/removeClass/)
- [x] [`toggleClass()`](http://api.jquery.com/toggleClass/)

- [x] [`after()`](http://api.jquery.com/after/)
- [x] [`append()`](http://api.jquery.com/append/)
- [x] [`attr()`](http://api.jquery.com/attr/)
- [x] [`children()`](http://api.jquery.com/children/)
- [x] [`closest()`](http://api.jquery.com/closest/)
- [x] [`clone()`](http://api.jquery.com/clone/) - clone events not yet supported
- [x] [`contents()`](http://api.jquery.com/contents/)
- [x] [`css()`](http://api.jquery.com/css/)
- [x] [`data()`](http://api.jquery.com/data/)
- [x] [`detach()`](http://api.jquery.com/detach/)
- [x] [`empty()`](http://api.jquery.com/empty/)
- [x] [`find()`](http://api.jquery.com/find/)
- [x] [`hasClass()`](http://api.jquery.com/hasClass/)
- [x] [`html()`](http://api.jquery.com/html/)
- [x] [`next()`](http://api.jquery.com/next/) - Does not support selectors
- [x] [`on()`](http://api.jquery.com/on/) - Does not support namespaces, selectors or eventData
- [x] [`off()`](http://api.jquery.com/off/) - Does not support namespaces or selectors
- [x] [`one()`](http://api.jquery.com/one/) - Does not support namespaces or selectors
- [x] [`parent()`](http://api.jquery.com/parent/)
- [x] [`prepend()`](http://api.jquery.com/prepend/)
- [x] [`prop()`](http://api.jquery.com/prop/)
- [x] [`ready()`](http://api.jquery.com/ready/)
- [x] [`remove()`](http://api.jquery.com/remove/)
- [x] [`removeAttr()`](http://api.jquery.com/removeAttr/)
- [x] [`removeData()`](http://api.jquery.com/removeData/)
- [x] [`replaceWith()`](http://api.jquery.com/replaceWith/)
- [x] [`text()`](http://api.jquery.com/text/)

- [x] [`trigger()`](http://api.jquery.com/trigger/) - Does not support selectors
- [x] [`val()`](http://api.jquery.com/val/)
- [x] [`wrap()`](http://api.jquery.com/wrap/)

- [x] [`click()`](http://api.jquery.com/click/)
- [x] [`focus()`](http://api.jquery.com/focus/)
- [x] [`blur()`](http://api.jquery.com/blur/)
- [x] [`submit()`](http://api.jquery.com/submit/)
