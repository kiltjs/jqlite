
describe('$ object', function () {

  var body = document.body,
      sampleHTML = '<ul><li>foo</li><li>bar</li><li>foobar</li></ul><ul><li>foo</li><li>bar</li><li>foobar</li></ul>';

	beforeEach(function () {
		body.innerHTML = sampleHTML;
	});

  it('should find as a selector', function () {

    expect( $('ul').length ).toBe(2);

    expect( $('ul li').length ).toBe(6);

  });

  it('should create dom list (1 item)', function () {

    var jUl = $('<ul>');

    expect( jUl.length ).toBe(1);

    expect( jUl[0] instanceof Element ).toBe(true);

  });

  it('should create dom list (several items)', function () {

    var jItems = $('<ul></ul><p>lorem ipsum</p>');

    expect( jItems.length ).toBe(2);

    expect( jItems[0] instanceof Element ).toBe(true);
    expect( jItems[1] instanceof Element ).toBe(true);

    expect( jItems[0].nodeName ).toMatch(/^ul$/i);
    expect( jItems[1].nodeName ).toMatch(/^p$/i);

  });

});
