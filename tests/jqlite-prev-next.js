/* global $, describe, beforeEach, expect, it */

describe('prev and next', function () {

  var body = document.body,
      sampleHTML = '<ul class="ul-foo"><li class="a-foo">foo</li><li class="a-bar">bar</li><li class="a-foobar">foobar</li></ul><ul class="ul-bar"><li class="b-foo">foo</li><li class="b-bar">bar</li><li class="b-foobar">foobar</li></ul>';

	beforeEach(function () {
		body.innerHTML = sampleHTML;
	});

  it('prev', function () {

    expect( $('.a-foobar, .b-foobar').prev().html(true) )
      .toBe('<li class="a-bar">bar</li><li class="b-bar">bar</li>');

  });

  it('prevAll', function () {

    expect( $('.a-foobar, .b-foobar').prevAll().html(true) )
      .toBe('<li class="a-foo">foo</li><li class="a-bar">bar</li><li class="b-foo">foo</li><li class="b-bar">bar</li>');

  });

});
