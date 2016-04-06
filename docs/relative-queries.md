
## Relative Queries

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
returns the HTMLElement in given `position`

#### eq(position) ~ [api.jquery.com/eq](http://api.jquery.com/eq/)

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
returns a [`collection`](#foot-notes) with only one element, specified by `position`, if is lower than 0 it will count backwards from the last element

#### first() ~ [api.jquery.com/first](http://api.jquery.com/first/)

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
returns a [`collection`](#foot-notes) with only the last element

#### last() ~ [api.jquery.com/last](http://api.jquery.com/last/)

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
returns a [`collection`](#foot-notes) with only the last element

#### find(selector) ~ [api.jquery.com/find](http://api.jquery.com/find/)

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
returns a [`collection`](#foot-notes) with elements that matches the `selector` from the given [`collection`](#foot-notes)

#### closest(selector) ~ [api.jquery.com/closest](http://api.jquery.com/closest/)

``` html
<ul class="list-1 foo">
  <li class="item-1"></li>
  <li class="item-2"></li>
</ul>
<ul class="list-2">
  <li class="item-3"></li>
  <li class="item-4"></li>
</ul>
<ul class="list-3 foo">
  <li class="item-5"></li>
  <li class="item-6"></li>
</ul>
```
``` js
  $('li').closest('.foo')
  // returns [
  // <ul class="list-1 foo"></ul>
  // <ul class="list-3 foo"></ul>
  // ]
```
returns a [`collection`](#foot-notes) with elements that matches the `selector` within the parents of the elements in the given [`collection`](#foot-notes)

- [x] [`prev()`](http://api.jquery.com/next/)
- [x] [`prevAll()`](http://api.jquery.com/next/)
- [x] [`next()`](http://api.jquery.com/next/)
- [x] [`nextAll()`](http://api.jquery.com/next/)

- [x] [`parent()`](http://api.jquery.com/parent/)
- [x] [`children()`](http://api.jquery.com/children/)

> <a name="foot-notes">
> collection: jqlite object returned by a query and find/filter like functions
