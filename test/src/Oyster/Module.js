const root = require('../../index');
const assert = require('chai').assert;


const LifeTime			= root.Duct.LifeTime;
const LifeBindFactory	= root.Duct.LT.LifeBindFactory;

const Module = root.Oyster.Module;


suite('Module', () => 
{
	test('module', () => 
	{
		var subject = new Module();
		var controller = { manager: () => {} };
		
		subject.setController(controller);
		
		assert.strictEqual(controller, subject.control());
	});
	
	test('manager', () => 
	{
		var subject = new Module();
		var obj = {};
		var controller = { manager: () => obj };
		
		subject.setController(controller);
		
		assert.strictEqual(obj, subject.manager());
	});
	
	test('app', () => 
	{
		var subject = new Module();
		var obj = {};
		var controller = { app: () => obj, manager: () => {} };
		
		subject.setController(controller);
		
		assert.strictEqual(obj, subject.app());
	});
	
	
	suite('LifeTime', () => 
	{
		test('LifeTime object is extracted from Module', () => 
		{
			var m = new Module();
			
			var lifeTime = LifeBindFactory.instance().get(m);
			
			assert.strictEqual(lifeTime, m.LT());
		});
		
		test('Non action passed to lifeTimeBuilder, return null', () => 
		{
			assert.isNull(Module.lifeTimeBuilder(123));
		});
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