/* global $, describe, beforeEach, expect, it */

describe('DOM Events', function () {

	var body = document.body,
      sampleHTML = '<ul class="foo"><li class="bar">foo</li><li>bar</li><li>foobar</li></ul><ul class="bar"><li>foo</li><li>bar</li><li>foobar</li></ul>';

	beforeEach(function () {
		body.innerHTML = sampleHTML;
	});

	it('on triggered', function (done) {
		var jDiv = $('<div>'), triggered = false;

		jDiv.on('signal', function (e, value) {
			triggered = true;
		});

		jDiv.trigger('signal', ['gogogo!']);

		setTimeout(function () {
			expect( triggered ).toBe(true);
			done();
		}, 1);
	});

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

	it('off', function () {
		var jDiv = $('<div>'), result = '';

		function addValue2result (e, value) {
			result += value;
		}

		jDiv.on('signal1', addValue2result);

		jDiv.trigger('signal1', ['foo']);

		expect( result ).toBe('foo');

		jDiv.off('signal1', addValue2result);

		jDiv.trigger('signal1', ['bar']);

		expect( result ).toBe('foo');
	});

	it('off once', function () {
		var jDiv = $('<div>'), result = '';

		function addValue2result (e, value) {
			result += value;
		}

		jDiv.once('signal1', addValue2result);
		jDiv.off('signal1', addValue2result);

		jDiv.trigger('signal1', ['foo']);
		jDiv.trigger('signal1', ['foo']);

		expect( result ).toBe('');
	});

	it('receive event in document', function (done) {

		$(document).on('event1', function (e, value) {
			expect(value).toBe('bar');
			done();
		});

		$('li.bar').trigger('event1', ['bar']);

	});

	it('receive two args in document', function (done) {

		$(document).on('event2', function (e, value, value2) {
			expect(value).toBe('foo');
			expect(value2).toBe('bar');
			done();
		});

		$('li.bar').trigger('event2', ['foo', 'bar']);

	});

	it('event stopPropagation', function () {

		var result, stopEvent = function (e) {
			e.stopPropagation();
		};

		$(document).on('event3', function (e, value) {
			result = value;
		});

		$('ul.foo').on('event3', stopEvent);

		$('li.bar').trigger('event3', ['bar']);

		expect(result).toBeUndefined();

		$('ul.foo').off('event3', stopEvent);

		$('li.bar').trigger('event3', ['bar']);

		expect(result).toBe('bar');

	});

	it('event stopPropagation method', function (done) {

		var result;

		$(document).on('event4', function (e, value) {
			result = value;
		});

		$('ul.foo').stopPropagation('event4');

		$('li.bar').trigger('event4', ['bar']);

		setTimeout(function () {
			expect(result).toBeUndefined();
			done();
		}, 0);

	});

	it('event off all listeners', function (done) {

		var count = 0;

		for( var i = 0 ; i < 10 ; i++ ) {
			$(document).on('event-all-off', function (e, value) {
				count++;
			});
		}

		$(document).trigger('event-all-off');

		$(document).off('event-all-off');

		$(document).trigger('event-all-off');
		$(document).trigger('event-all-off');
		$(document).trigger('event-all-off');
		$(document).trigger('event-all-off');
		$(document).trigger('event-all-off');
		$(document).trigger('event-all-off');
		$(document).trigger('event-all-off');

		setTimeout(function () {
			expect(count).toBe(10);
			done();
		}, 0);

	});

	it('event off all listeners (2)', function (done) {

		var count = 0;

		for( var i = 0 ; i < 10 ; i++ ) {
			$(document).on('event-all-off', function (e, value) {
				count++;
			});
		}

		$(document).trigger('event-all-off');

		$(document).off('event-all-off');

		$(document).trigger('event-all-off');

		$(document).on('event-all-off', function (e, value) {
			count++;
		});

		$(document).trigger('event-all-off');

		$(document).off('event-all-off');

		$(document).trigger('event-all-off');

		setTimeout(function () {
			expect(count).toBe(11);
			done();
		}, 0);

	});

	it('event off all listeners (3)', function (done) {

		var count = 0;

		for( var i = 0 ; i < 10 ; i++ ) {
			$(document).on('event-all-off', function (e, value) {
				count++;
			});
		}

		$(document).trigger('event-all-off');

		$(document).off();

		$(document).trigger('event-all-off');

		$(document).on('event-all-off', function (e, value) {
			count++;
		});

		$(document).trigger('event-all-off');

		$(document).off();

		$(document).trigger('event-all-off');

		setTimeout(function () {
			expect(count).toBe(11);
			done();
		}, 0);

	});

});
