/* global $, describe, beforeEach, expect, it */

describe('data (set)', function () {

  var body = document.body,
      sampleHTML = '<ul><li>foo</li><li>bar</li><li>foobar</li></ul><ul><li>foo</li><li>bar</li><li>foobar</li></ul>',
      ul1;

	beforeEach(function () {
		body.innerHTML = sampleHTML;
    ul1 = $('ul').eq(0);
    ul1.data('foo', 'bar');
    ul1.dataset('fooset', 'barset');
	});

  it('get data value', function () {

    expect(ul1.data('foo')).toBe('bar');

  });

  it('check data instance', function () {
    var crash = { test: 'dummy' };

    ul1.data('crash', crash);

    expect( ul1.data('crash') ).toBe( crash );

  });

  it('set data attribute', function () {

    ul1.data('foo', 'foobar');

    expect( ul1.data('foo') ).toBe('foobar');

  });

  it('remove data attribute', function () {

    ul1.removeData('foo');

    expect( ul1.data('foo') ).toBeUndefined();

  });

  it('get dataset attribute', function () {

    expect(ul1.dataset('fooset')).toBe('barset');

  });

  it('set dataset attribute', function () {

    ul1.dataset('fooset', 'foobar');

    expect( ul1.dataset('fooset') ).toBe('foobar');

  });

  it('remove dataset attribute', function () {

    ul1.removeDataset('fooset');

    expect( ul1.dataset('fooset') ).toBeUndefined();

  });

  it('set data attribute several ULs', function () {

    var jUL = $('ul');

    jUL.dataset('fooset', 'foobar');

    expect( jUL.length ).toBe(2);

    jUL.each(function () {
      expect( this.getAttribute('data-fooset') ).toBe('foobar');
    });

  });

});
