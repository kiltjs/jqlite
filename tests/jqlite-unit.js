
describe('jstool: jqlite', function () {

	var baseNode = document.createElement('div');

	baseNode.className = 'base-node';

	document.body.appendChild(baseNode);

	it('will run', function () {
		baseNode.innerHTML = '<article id="item-id" class="parent element" data-some="attribute"><section class="post"><a class="link"></a></section></article>';

		expect( $('#item-id > section').length ).toBe(1);
	});

	// console.log('document', document.body.innerHTML, Object.keys(window) );

});