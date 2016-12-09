/* global $, describe, beforeEach, expect, it */

describe('class manipulation', function () {

  var body = document.body,
      sampleHTML = '<ul><li class="foo">foo</li><li class="bar">bar</li><li class="foobar">foobar</li></ul><ul><li class="foo">foo</li><li class="bar">bar</li><li class="foobar">foobar</li></ul>',
      ul1;

	beforeEach(function () {
		body.innerHTML = sampleHTML;
    ul1 = $('ul').eq(0);

    ul1.addClass('ulfoo');
	});

  it('check class', function () {

    expect( ul1[0].className ).toMatch(/^|\bulfoo\b|$/);
    expect( ul1.hasClass('ulfoo') ).toBe(true);
    expect( ul1.hasClass('ulfoo2') ).toBe(false);

  });

  it('add class', function () {

    ul1.addClass('ulfoo2');

    expect( ul1[0].className ).toMatch(/^|\bulfoo\b|$/);
    expect( ul1[0].className ).toMatch(/^|\bulfoo2\b|$/);

    expect( ul1.hasClass('ulfoo') ).toBe(true);
    expect( ul1.hasClass('ulfoo2') ).toBe(true);

  });

  it('add class multiple', function () {

    expect( ul1.hasClass('ulfoo') ).toBe(true);
    expect( ul1.hasClass('ulfoo2') ).toBe(false);
    expect( ul1.hasClass('ulfoo3') ).toBe(false);

    ul1.addClass('ulfoo2 ulfoo3');

    expect( ul1.hasClass('ulfoo') ).toBe(true);
    expect( ul1.hasClass('ulfoo2') ).toBe(true);
    expect( ul1.hasClass('ulfoo3') ).toBe(true);

  });

  it('add class function', function () {

    var addFoo = function () {
      if( $(this).hasClass('ulfoo2') ) {
        return 'ulfoo3';
      } else {
        return 'ulfoo2';
      }
    };

    expect( ul1.hasClass('ulfoo') ).toBe(true);
    expect( ul1.hasClass('ulfoo2') ).toBe(false);
    expect( ul1.hasClass('ulfoo3') ).toBe(false);

    ul1.addClass(addFoo);

    expect( ul1.hasClass('ulfoo') ).toBe(true);
    expect( ul1.hasClass('ulfoo2') ).toBe(true);
    expect( ul1.hasClass('ulfoo3') ).toBe(false);

    ul1.addClass(addFoo);

    expect( ul1.hasClass('ulfoo') ).toBe(true);
    expect( ul1.hasClass('ulfoo2') ).toBe(true);
    expect( ul1.hasClass('ulfoo3') ).toBe(true);

    ul1.addClass(addFoo);

    expect( ul1.hasClass('ulfoo') ).toBe(true);
    expect( ul1.hasClass('ulfoo2') ).toBe(true);
    expect( ul1.hasClass('ulfoo3') ).toBe(true);

  });


  it('remove class', function () {

    ul1.removeClass('ulfoo');
    expect( ul1.hasClass('ulfoo') ).toBe(false);

    ul1.addClass('ulfoo2');
    expect( ul1.hasClass('ulfoo2') ).toBe(true);

    ul1.removeClass('ulfoo2');
    expect( ul1.hasClass('ulfoo2') ).toBe(false);
  });

  it('remove class multiple', function () {

    expect( ul1.hasClass('ulfoo') ).toBe(true);
    expect( ul1.hasClass('ulfoo2') ).toBe(false);
    expect( ul1.hasClass('ulfoo3') ).toBe(false);

    ul1.removeClass('ulfoo ulfoo2 ulfoo3');

    expect( ul1.hasClass('ulfoo') ).toBe(false);
    expect( ul1.hasClass('ulfoo2') ).toBe(false);
    expect( ul1.hasClass('ulfoo3') ).toBe(false);

    ul1.addClass('ulfoo ulfoo2');

    expect( ul1.hasClass('ulfoo') ).toBe(true);
    expect( ul1.hasClass('ulfoo2') ).toBe(true);
    expect( ul1.hasClass('ulfoo3') ).toBe(false);

    ul1.removeClass('ulfoo ulfoo2 ulfoo3');

    expect( ul1.hasClass('ulfoo') ).toBe(false);
    expect( ul1.hasClass('ulfoo2') ).toBe(false);
    expect( ul1.hasClass('ulfoo3') ).toBe(false);

    ul1.addClass('ulfoo ulfoo2 ulfoo3');

    expect( ul1.hasClass('ulfoo') ).toBe(true);
    expect( ul1.hasClass('ulfoo2') ).toBe(true);
    expect( ul1.hasClass('ulfoo3') ).toBe(true);

    ul1.removeClass('ulfoo ulfoo2 ulfoo3');

    expect( ul1.hasClass('ulfoo') ).toBe(false);
    expect( ul1.hasClass('ulfoo2') ).toBe(false);
    expect( ul1.hasClass('ulfoo3') ).toBe(false);

  });

  it('remove class function', function () {

    var i = 0;
    var removeFoo = function () {
      return i++ ? 'ulfoo' : 'no-foo';
    };

    expect( ul1.hasClass('ulfoo') ).toBe(true);

    ul1.removeClass(removeFoo);

    expect( ul1.hasClass('ulfoo') ).toBe(true);

    ul1.removeClass(removeFoo);

    expect( ul1.hasClass('ulfoo') ).toBe(false);

  });


  it('toggle class', function () {

    ul1.toggleClass('ulfoo2');

    expect( ul1.hasClass('ulfoo2') ).toBe(true);

    ul1.toggleClass('ulfoo2');

    expect( ul1.hasClass('ulfoo2') ).toBe(false);

    ul1.toggleClass('ulfoo2');

    expect( ul1.hasClass('ulfoo2') ).toBe(true);

    ul1.toggleClass('ulfoo2');

    expect( ul1.hasClass('ulfoo2') ).toBe(false);

  });

  it('toggle class state true', function () {

    ul1.toggleClass('ulfoo2', true);

    expect( ul1.hasClass('ulfoo2') ).toBe(true);

    ul1.toggleClass('ulfoo2', true);

    expect( ul1.hasClass('ulfoo2') ).toBe(true);

    ul1.toggleClass('ulfoo2', true);

    expect( ul1.hasClass('ulfoo2') ).toBe(true);

  });

  it('toggle class state false', function () {

    ul1.toggleClass('ulfoo2', false);

    expect( ul1.hasClass('ulfoo2') ).toBe(false);

    ul1.toggleClass('ulfoo2', false);

    expect( ul1.hasClass('ulfoo2') ).toBe(false);

    ul1.toggleClass('ulfoo2', false);

    expect( ul1.hasClass('ulfoo2') ).toBe(false);

  });

  it('toggle class function', function () {

    var toggleFoo = function () {
      if( $(this).hasClass('ulfoo') ) {
        return 'ulfoo';
      } else {
        return 'ulfoo2';
      }
    };

    expect( ul1.hasClass('ulfoo') ).toBe(true);

    ul1.toggleClass(toggleFoo);
    expect( ul1.hasClass('ulfoo') ).toBe(false);
    expect( ul1.hasClass('ulfoo2') ).toBe(false);

    ul1.toggleClass(toggleFoo);
    expect( ul1.hasClass('ulfoo') ).toBe(false);
    expect( ul1.hasClass('ulfoo2') ).toBe(true);

    ul1.toggleClass(toggleFoo);
    expect( ul1.hasClass('ulfoo') ).toBe(false);
    expect( ul1.hasClass('ulfoo2') ).toBe(false);

  });


  it('add class to several ul', function () {

    var jUL = $('ul');

    jUL.addClass('ulfoo2');

    expect( $('ul.ulfoo2').length ).toBe(2);

  });

  it('remove class from several elements', function () {

    $('.foo').removeClass('foo');

    expect( $('.foo').length ).toBe(0);

  });

  it('add several classes to several ul', function () {

    var jUL = $('ul');

    jUL.addClass('item list');

    expect( $('ul.item.list').length ).toBe(2);

  });

});
