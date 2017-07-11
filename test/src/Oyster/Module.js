const root = require('../../index');
const assert = require('chai').assert;


const Module = root.Oyster.Module;


suite('Module', () => 
{
	test('module', () => 
	{
		var subject = new Module();
		var controller = {};
		
		subject.setController(controller);
		
		assert.strictEqual(controller, subject.module());
	});
	
	test('manager', () => 
	{
		var subject = new Module();
		var obj = {};
		var controller = { manager: () => obj };
		
		subject.setController(controller);
		
		assert.strictEqual(obj, subject.manager());
	});
	
	
	test('sanity', () => 
	{
		var subject = new Module();
		
		subject.initialize();
		subject.preLoad();
		subject.onLoad();
		subject.postLoad();
		subject.preUnload();
		subject.onUnload();
		subject.postUnload();
		subject.destroy();
	});
});