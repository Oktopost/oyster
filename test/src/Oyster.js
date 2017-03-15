require('../../src/Oyster');


var assert 	= require('assert');
var chai 	= require('chai');
var oyster 	= window.Oyster;


suite('Oyster', function() {
  	suite('register', function() {
    	test('should return the same object', function() {
    		var a = {};

    		oyster.register('Test', a);

      		assert.equal(a, oyster.Test);
    	});

    	test('namespace created', function() {
    		oyster.register('my.Test', {});

    		chai.assert.isDefined(oyster.my, 'namespace is undefined');
    	});

    	test('object override', function() {
    		var a = {};
    		var b = {};

    		oyster.register('my.new.Test', a);
    		oyster.register('my.new.Test', b);

    		assert.equal(b, oyster.my.new.Test);
    	});
  	});

  	suite('instance', function() {
    	test('should return the same object', function() {
    		var a = {};

    		oyster.register('Test', a);

      		assert.equal(a, oyster.instance('Test'));
    	});
  	});
});