
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

    expect( ul1.className ).toMatch(/^|\bulfoo\b|$/);
    expect( ul1.hasClass('ulfoo') ).toBe(true);

  });

  it('set class', function () {

    ul1.addClass('ulfoo2');

    expect( ul1.className ).toMatch(/^|\bulfoo\b|$/);
    expect( ul1.className ).toMatch(/^|\bulfoo2\b|$/);

    expect( ul1.hasClass('ulfoo') ).toBe(true);
    expect( ul1.hasClass('ulfoo2') ).toBe(true);

  });

  it('remove class', function () {

    ul1.removeClass('ulfoo');

    expect( ul1.className ).not.toMatch(/ulfoo/);
    expect( ul1.hasClass('ulfoo') ).toBe(false);

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
