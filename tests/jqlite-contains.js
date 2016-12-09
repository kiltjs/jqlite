/* global $, describe, beforeEach, expect, it */

describe('Content', function () {

	var body = document.body,
      sampleHTML = '<ul><li>foo</li><li>bar</li><li>foobar</li></ul><ul><li>foo</li><li>bar</li><li>foobar</li></ul>';

	beforeEach(function () {
    $(body).html(sampleHTML);
	});

	it('contains documentElement, body', function () {
    expect( $.contains(document.documentElement, document.body) ).toBe(true);
	});

  it('contains body, documentElement', function () {
    expect( $.contains(document.body, document.documentElement) ).toBe(false);
	});

});
