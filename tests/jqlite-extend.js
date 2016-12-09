/* global $, describe, beforeEach, expect, it */

describe('Object extend functions', function () {

	it('$.extend', function () {
		var o = { foo: 'bar' };

		$.extend(o, { crash: 'test' }, { test: 'dummy' });

		expect( JSON.stringify(o) ).toBe( '{"foo":"bar","crash":"test","test":"dummy"}');
	});

	it('$.extend (2)', function () {
		var o = { foo: 'bar' };

		$.extend(o, { crash: 'test', test: { dummy: 'oO' } }, { test: 'dummy' });

		expect( JSON.stringify(o) ).toBe( '{"foo":"bar","crash":"test","test":"dummy"}');
	});

	it('$.extend (deep)', function () {

		var o = {};

		$.extend(true, o, { crash: 'test', test: { dummy: 'oO' } }, { test: { foo: 'bar' } });

		expect( JSON.stringify(o) ).toBe( '{"crash":"test","test":{"dummy":"oO","foo":"bar"}}');
	});

	it('$.extend (deep) (2)', function () {

		var o = {};

		$.extend(true, o, { crash: 'test', test: { list: [1,2,3] } }, { test: { list: [4,5,6] } });

		expect( JSON.stringify(o) ).toBe( '{"crash":"test","test":{"list":[1,2,3,4,5,6]}}');
	});

});
