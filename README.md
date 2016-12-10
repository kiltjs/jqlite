# jqLite

Tiny JavaScript DOM query library that uses pure CSS selectors

[![](https://img.shields.io/npm/v/jqlite.svg)](https://www.npmjs.com/package/jqlite) [![](https://img.shields.io/bower/v/jstools-jqlite.svg)](http://bower.io/search/?q=kiltjs-jqlite) [![Build Status](https://travis-ci.org/kiltjs/jqlite.svg?branch=master)](https://travis-ci.org/kiltjs/jqlite) [![](https://img.shields.io/npm/dm/jqlite.svg)](https://www.npmjs.com/package/jqlite)


-----------

## Installation

```.sh
npm install jqlite --save
```
  or
```.sh
bower install kilt-jqlite --save
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

## Relative Queries

- [`get()`](docs/relative-queries.md#getposition--apijquerycomget)
- [`eq()`](docs/relative-queries.md#eqposition--apijquerycomeq)
- [`first()`](docs/relative-queries.md#first--apijquerycomfirst)
- [`last()`](docs/relative-queries.md#last--apijquerycomlast)
- [`find()`](docs/relative-queries.md#findselector--apijquerycomfind)
- [`closest()`](docs/relative-queries.md#closestselector--apijquerycomclosest)

> missing docs:

- [`prev()`](http://api.jquery.com/next/)
- [`prevAll()`](http://api.jquery.com/next/)
- [`next()`](http://api.jquery.com/next/)
- [`nextAll()`](http://api.jquery.com/next/)

- [`parent()`](http://api.jquery.com/parent/)
- [`children()`](http://api.jquery.com/children/)

### Handling Classes

- [`addClass()`](docs/relative-queries.md#addclassclassname--apijquerycomaddclass)
- [`removeClass()`](docs/relative-queries.md#removeclassclassname--apijquerycomremoveclass)
- [`toggleClass()`](docs/relative-queries.md#toggleclassclassnamestate--apijquerycomtoggleclass)

### Moving DOM Elements

> missing docs:

- [`append()`](http://api.jquery.com/append/)
- [`prepend()`](http://api.jquery.com/prepend/)
- [`before(content)`](http://api.jquery.com/before/)
- [`after(content)`](http://api.jquery.com/after/)

- [`wrap()`](http://api.jquery.com/wrap/)

- [`replaceWith()`](http://api.jquery.com/replaceWith/)
- [`detach()`](http://api.jquery.com/detach/)
- [`remove()`](http://api.jquery.com/remove/)

### Getters / Setters

- [`val()`](http://api.jquery.com/val/)
- [`html()`](http://api.jquery.com/html/)
- [`text()`](http://api.jquery.com/text/)
- [`contents()`](http://api.jquery.com/contents/)

- [`prop()`](http://api.jquery.com/prop/)
- [`attr()`](http://api.jquery.com/attr/)
- [`removeAttr()`](http://api.jquery.com/removeAttr/)
- [`data()`](http://api.jquery.com/data/)
- [`removeData()`](http://api.jquery.com/removeData/)

- [`empty()`](http://api.jquery.com/empty/)

### Miscelanea

- [`clone()`](http://api.jquery.com/clone/) - clone events not yet supported
- [`css()`](http://api.jquery.com/css/)

### Event Methods

- [`on()`](http://api.jquery.com/on/) - Does not support namespaces, selectors or eventData
- [`off()`](http://api.jquery.com/off/) - Does not support namespaces or selectors
- [`one()`](http://api.jquery.com/one/) - Does not support namespaces or selectors
- [`trigger()`](http://api.jquery.com/trigger/) - Does not support selectors

- [`click()`](http://api.jquery.com/click/)
- [`focus()`](http://api.jquery.com/focus/)
- [`blur()`](http://api.jquery.com/blur/)
- [`submit()`](http://api.jquery.com/submit/)

> <a name="foot-notes">
> collection: jqlite object returned by a query and find/filter like functions
