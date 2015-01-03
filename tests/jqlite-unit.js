
describe('jstool: jqlite', function () {

	var body = document.body;

	beforeEach(function () {
		body.innerHTML = '';
	});

	it('find', function () {
		body.innerHTML = '<article id="item-id" class="parent element" data-some="attribute"><section class="post"><a class="link"></a></section></article>';
		expect( $('#item-id > section').length ).toBe(1);
	});

	it('find: multiple', function () {
		body.innerHTML = '<ul><li>foo</li><li>bar</li><li>foobar</li></ul>';
		expect( $(body).find('ul > li').length ).toBe(3);
	});

	it('find: multiple', function () {
		body.innerHTML = '<ul><li>foo</li><li>bar</li><li>foobar</li></ul><ul><li>foo</li><li>bar</li><li>foobar</li></ul>';
		expect( $(body).find('ul').find('li').length ).toBe(6);
	});

	it('find: nested no duplicates', function () {
		body.innerHTML = '<ul><li>foo</li><li>bar</li><li>foobar<ul><li>foo</li><li>bar</li><li>foobar</li></ul></li></ul><ul><li>foo</li><li>bar</li><li>foobar</li></ul>';
		expect( $(body).find('ul').find('li').length ).toBe(9);
	});

});