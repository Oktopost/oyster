require('../../src/Oyster');
require('../../src/Route');


var assert 	= require('assert');
var chai 	= require('chai');
var route 	= window.Oyster.instance('Route');


suite('Route', function() {
	suite('getRoute', function() {
		test('should fall back to index', function() {
			assert.equal('IndexController', route.getRoute('/'));
		});

		test('should capitalize', function() {
			assert.equal('MyRemoteHomeController', route.getRoute('/my-remote/home'));
		});

		test('should override parser', function() {
			var myParser = function (url) {
				return 'MyController';
			};

			route.setParser(myParser);

			assert.equal('MyController', route.getRoute('/my-remote/home'));
		});
	});
});