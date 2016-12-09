/* global $, describe, beforeEach, expect, it */

describe('Content', function () {

	var body = document.body,
      sampleHTML = '<ul><li>foo</li><li>bar</li><li>foobar</li></ul><ul><li>foo</li><li>bar</li><li>foobar</li></ul>';

	beforeEach(function () {
    $(body).html(sampleHTML);
	});

	it('get html', function () {
    expect( body.innerHTML ).toBe(sampleHTML);
	});

  it('set html', function () {
    $('ul').html('<li></li>');

    expect( body.innerHTML ).toBe('<ul><li></li></ul><ul><li></li></ul>');
	});

  it('get text', function () {
    expect( $('ul').text() ).toBe('foobarfoobarfoobarfoobar');
	});

  it('set text', function () {
    $('ul').text('foobar');

    expect( body.innerHTML ).toBe('<ul>foobar</ul><ul>foobar</ul>');
	});

});
