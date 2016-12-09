/* global $, describe, beforeEach, expect, it */

describe('wrap', function () {

  var body = document.body,
      sampleHTML = '<ul class="ul-foo"><li class="a-foo">foo</li><li class="a-foo">bar</li><li class="a-foobar">foobar</li></ul><ul class="ul-bar"><li class="b-foo">foo</li><li class="b-bar">bar</li><li class="b-foobar">foobar</li></ul>';

	beforeEach(function () {
		body.innerHTML = sampleHTML;
	});

  it('wrap ULs', function () {

    $('ul').wrap('<div class="wrapper"></div>');

    expect( body.innerHTML ).toBe('<div class="wrapper"><ul class="ul-foo"><li class="a-foo">foo</li><li class="a-foo">bar</li><li class="a-foobar">foobar</li></ul></div><div class="wrapper"><ul class="ul-bar"><li class="b-foo">foo</li><li class="b-bar">bar</li><li class="b-foobar">foobar</li></ul></div>');

  });

  it('wrap ULs callback', function () {

    $('ul').wrap(function (i) {
      return '<div class="wrapper-' + i + '"></div>';
    });

    expect( body.innerHTML ).toBe('<div class="wrapper-0"><ul class="ul-foo"><li class="a-foo">foo</li><li class="a-foo">bar</li><li class="a-foobar">foobar</li></ul></div><div class="wrapper-1"><ul class="ul-bar"><li class="b-foo">foo</li><li class="b-bar">bar</li><li class="b-foobar">foobar</li></ul></div>');

  });

  it('wrap LIs', function () {

    $('li').wrap('<div class="wrapper"></div>');

    expect( body.innerHTML ).toBe('<ul class="ul-foo"><div class="wrapper"><li class="a-foo">foo</li></div><div class="wrapper"><li class="a-foo">bar</li></div><div class="wrapper"><li class="a-foobar">foobar</li></div></ul><ul class="ul-bar"><div class="wrapper"><li class="b-foo">foo</li></div><div class="wrapper"><li class="b-bar">bar</li></div><div class="wrapper"><li class="b-foobar">foobar</li></div></ul>');

  });

  it('wrap LIs callback', function () {

    $('li').wrap(function (i) {
      return '<div class="wrapper-' + i + '"></div>';
    });

    expect( body.innerHTML ).toBe('<ul class="ul-foo"><div class="wrapper-0"><li class="a-foo">foo</li></div><div class="wrapper-1"><li class="a-foo">bar</li></div><div class="wrapper-2"><li class="a-foobar">foobar</li></div></ul><ul class="ul-bar"><div class="wrapper-3"><li class="b-foo">foo</li></div><div class="wrapper-4"><li class="b-bar">bar</li></div><div class="wrapper-5"><li class="b-foobar">foobar</li></div></ul>');

  });

  it('wrapAll ULs', function () {

    $('ul').wrapAll('<div class="wrapper"></div>');

    expect( body.innerHTML ).toBe('<div class="wrapper"><ul class="ul-foo"><li class="a-foo">foo</li><li class="a-foo">bar</li><li class="a-foobar">foobar</li></ul><ul class="ul-bar"><li class="b-foo">foo</li><li class="b-bar">bar</li><li class="b-foobar">foobar</li></ul></div>');

  });

  it('wrapAll LIs', function () {

    $('li').wrapAll('<div class="wrapper"></div>');

    expect( body.innerHTML ).toBe('<ul class="ul-foo"><div class="wrapper"><li class="a-foo">foo</li><li class="a-foo">bar</li><li class="a-foobar">foobar</li><li class="b-foo">foo</li><li class="b-bar">bar</li><li class="b-foobar">foobar</li></div></ul><ul class="ul-bar"></ul>');

  });

  it('unwrap LIs', function () {

    $('li').unwrap();

    expect( body.innerHTML ).toBe('<li class="a-foo">foo</li><li class="a-foo">bar</li><li class="a-foobar">foobar</li><li class="b-foo">foo</li><li class="b-bar">bar</li><li class="b-foobar">foobar</li>');

  });

});
