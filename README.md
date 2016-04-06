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

## Main Methods

- [x] [`ready()`](http://api.jquery.com/ready/)

## Collection Methods

#### get(position) ~ [api.jquery.com/get](http://api.jquery.com/get/)

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

## Relative Queries

- [`eq()`](docs/relative-queries#eqposition---apijquerycomeq)
- [`first()`](docs/relative-queries#first---apijquerycomfirst)
- [`last()`](docs/relative-queries#last---apijquerycomlast)
- [`find()`](docs/relative-queries#find---apijquerycomfind)
- [`closest()`](docs/relative-queries#closest---apijquerycomclosest)

- [x] [`prev()`](http://api.jquery.com/next/)
- [x] [`prevAll()`](http://api.jquery.com/next/)
- [x] [`next()`](http://api.jquery.com/next/)
- [x] [`nextAll()`](http://api.jquery.com/next/)

- [x] [`parent()`](http://api.jquery.com/parent/)
- [x] [`children()`](http://api.jquery.com/children/)

### Handling Classes

#### addClass(className) ~ [api.jquery.com/addClass](http://api.jquery.com/addClass/)

``` html
<div class="item-1"></div>
<div class="item-2"></div>
<div class="item-3"></div>
```
``` js
  $('.item-2').addClass('foobar')
  // results:
  // <div class="item-1"></div>
  // <div class="item-2 foobar"></div>
  // <div class="item-3"></div>
```

#### removeClass(className) ~ [api.jquery.com/removeClass](http://api.jquery.com/removeClass/)

``` html
<div class="item-1 foobar"></div>
<div class="item-2 foobar"></div>
<div class="item-3 foobar"></div>
```
``` js
  $('.item-2').removeClass('foobar')
  // results:
  // <div class="item-1 foobar"></div>
  // <div class="item-2"></div>
  // <div class="item-3 foobar"></div>
```

#### toggleClass(className, state) ~ [api.jquery.com/addClass](http://api.jquery.com/addClass/)

``` html
<div class="item-1 foobar"></div>
<div class="item-2"></div>
<div class="item-3 foobar"></div>
```
``` js
  $('div').toggleClass('foobar')
  // results:
  // <div class="item-1"></div>
  // <div class="item-2 foobar"></div>
  // <div class="item-3"></div>

  $('div').toggleClass('foobar', true)
  // results:
  // <div class="item-1 foobar"></div>
  // <div class="item-2 foobar"></div>
  // <div class="item-3 foobar"></div>
```
----------

## Moving DOM Elements

- [x] [`append()`](http://api.jquery.com/append/)
- [x] [`prepend()`](http://api.jquery.com/prepend/)
- [x] [`after(content)`](http://api.jquery.com/after/)

- [x] [`wrap()`](http://api.jquery.com/wrap/)

- [x] [`replaceWith()`](http://api.jquery.com/replaceWith/)
- [x] [`detach()`](http://api.jquery.com/detach/)
- [x] [`remove()`](http://api.jquery.com/remove/)

### Getters / Setters

- [x] [`val()`](http://api.jquery.com/val/)
- [x] [`html()`](http://api.jquery.com/html/)
- [x] [`text()`](http://api.jquery.com/text/)
- [x] [`contents()`](http://api.jquery.com/contents/)

- [x] [`prop()`](http://api.jquery.com/prop/)
- [x] [`attr()`](http://api.jquery.com/attr/)
- [x] [`removeAttr()`](http://api.jquery.com/removeAttr/)
- [x] [`data()`](http://api.jquery.com/data/)
- [x] [`removeData()`](http://api.jquery.com/removeData/)

- [x] [`empty()`](http://api.jquery.com/empty/)

### Miscelanea

- [x] [`clone()`](http://api.jquery.com/clone/) - clone events not yet supported
- [x] [`css()`](http://api.jquery.com/css/)

### Event Methods

- [x] [`on()`](http://api.jquery.com/on/) - Does not support namespaces, selectors or eventData
- [x] [`off()`](http://api.jquery.com/off/) - Does not support namespaces or selectors
- [x] [`one()`](http://api.jquery.com/one/) - Does not support namespaces or selectors
- [x] [`trigger()`](http://api.jquery.com/trigger/) - Does not support selectors

- [x] [`click()`](http://api.jquery.com/click/)
- [x] [`focus()`](http://api.jquery.com/focus/)
- [x] [`blur()`](http://api.jquery.com/blur/)
- [x] [`submit()`](http://api.jquery.com/submit/)

> <a name="foot-notes">
> collection: jqlite object returned by a query and find/filter like functions
