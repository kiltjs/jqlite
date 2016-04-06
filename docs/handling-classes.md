
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

> <a name="foot-notes">
> collection: jqlite object returned by a query and find/filter like functions
