
describe('data (set)', function () {

  var body = document.body,
      sampleHTML = '<ul><li>foo</li><li>bar</li><li>foobar</li></ul><ul><li>foo</li><li>bar</li><li>foobar</li></ul>',
      ul1;

	beforeEach(function () {
		body.innerHTML = sampleHTML;
    ul1 = $('ul').eq(0);
    ul1.data('foo', 'bar');
	});

  it('get data attribute', function () {

    expect(ul1.data('foo')).toBe('bar');

  });

  it('set data attribute', function () {

    ul1.data('foo', 'foobar');

    expect( ul1.data('foo') ).toBe('foobar');

  });

  it('remove data attribute', function () {

    ul1.removeData('foo');

    expect( ul1.data('foo') ).toBeUndefined();

  });

  it('set data attribute several ULs', function () {

    var jUL = $('ul');

    jUL.data('foo', 'foobar');

    expect( jUL.length ).toBe(2);

    jUL.each(function (index) {
      expect( this.getAttribute('data-foo') ).toBe('foobar');
    });

  });

});
