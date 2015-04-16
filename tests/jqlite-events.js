
describe('jstool: jqlite', function () {

	it('on', function (done) {
		var jDiv = $('<div>'), result;

		jDiv.on('signal', function (e, value) {
			result = value;
		});

		jDiv.trigger('signal', ['gogogo!']);

		setTimeout(function () {
			expect( result ).toBe('gogogo!');
			done();
		}, 1);
	});

	it('on (map)', function (done) {
		var jDiv = $('<div>'), result = '';

		jDiv.on({
			'signal1': function (e, value) {
				result += value;
			},
			'signal2': function (e, value) {
				result += value;
			},
		});

		jDiv.trigger('signal1', ['foo']);
		jDiv.trigger('signal2', ['bar']);

		setTimeout(function () {
			expect( result ).toBe('foobar');
			done();
		}, 1);
	});

	it('on (array)', function (done) {
		var jDiv = $('<div>'), result = '';

		jDiv.on(['signal1', 'signal2'], function (e, value) {
			result += value;
		});

		jDiv.trigger('signal1', ['foo']);
		jDiv.trigger('signal2', ['bar']);

		setTimeout(function () {
			expect( result ).toBe('foobar');
			done();
		}, 1);
	});

	it('once', function (done) {
		var jDiv = $('<div>'), result = '';

		jDiv.one('signal', function (e, value) {
			result += value;
		});

		jDiv.trigger('signal', ['gogogo!']);
		jDiv.trigger('signal', ['gogogo!']);

		setTimeout(function () {
			expect( result ).toBe('gogogo!');
			done();
		}, 1);
	});

	it('once (map)', function (done) {
		var jDiv = $('<div>'), result = '';

		jDiv.once({
			'signal1': function (e, value) {
				result += value;
			},
			'signal2': function (e, value) {
				result += value;
			},
		});

		jDiv.trigger('signal1', ['foo']);
		jDiv.trigger('signal2', ['bar']);

		jDiv.trigger('signal1', ['foo']);
		jDiv.trigger('signal2', ['bar']);

		setTimeout(function () {
			expect( result ).toBe('foobar');
			done();
		}, 1);
	});

	it('once (array)', function (done) {
		var jDiv = $('<div>'), result = '';

		jDiv.once(['signal1', 'signal2'], function (e, value) {
			result += value;
		});

		jDiv.trigger('signal1', ['foo']);
		jDiv.trigger('signal2', ['bar']);

		jDiv.trigger('signal1', ['foo']);
		jDiv.trigger('signal2', ['bar']);

		setTimeout(function () {
			expect( result ).toBe('foobar');
			done();
		}, 1);
	});

});
