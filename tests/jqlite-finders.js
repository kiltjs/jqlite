/* global $, describe, beforeEach, expect, it */

describe('finders', function () {

  var body = document.body,
      sampleHTML = '<ul class="ul-foo"><li class="a-foo">foo</li><li class="a-foo">bar</li><li class="a-foobar">foobar</li></ul><ul class="ul-bar"><li class="b-foo">foo</li><li class="b-bar">bar</li><li class="b-foobar">foobar</li></ul>';

	beforeEach(function () {
		body.innerHTML = sampleHTML;
	});

  it('closest num', function () {

    var jLi = $('li'),
        jUl = jLi.closest('ul');

    expect( jLi.length ).toBe(6);
    expect( jUl.length ).toBe(2);

    expectedClasses = ['ul-foo', 'ul-bar'];

    jUl.each(function (i) {
      expect( this.className ).toBe( expectedClasses[i] );
    });

  });

});
