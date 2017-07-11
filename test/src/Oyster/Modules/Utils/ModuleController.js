const root = require('../../../../index');
const assert = require('chai').assert;


const ModuleController = root.Oyster.Modules.Utils.ModuleController;


suite('ModuleController', () => 
{
	test('name', () => 
	{
		assert.equal('a', (new ModuleController({}, 'a')).name());
	});
	
	test('manager', () => 
	{
		var manager = {};
		assert.equal(manager, (new ModuleController(manager, 'a')).manager());
	});
	
	
	suite('unload', () => 
	{
		test('not loaded, unload not invoked', () => 
		{
			var isCalled = false;
			var manager = { remove: () => { isCalled = true; }};
			
			(new ModuleController(manager, 'a')).unload();
			
			assert.equal(false, isCalled);
		});
		
		test('loaded, unload invoked', () => 
		{
			var isCalled = false;
			var manager = { remove: () => { isCalled = true; }};
			
			var obj = new ModuleController(manager, 'a');
			obj.setIsLoaded(true);
			obj.unload();
			
			assert.equal(true, isCalled);
		});
	});
	
	
	suite('isLoaded', () => 
	{
		test('new Object, return false', () => 
		{
			assert.equal(false, (new ModuleController()).isLoaded());
		});
		
		test('setIsLoaded, return value', () => 
		{
			var subject = new ModuleController();
			
			subject.setIsLoaded(true);
			assert.equal(true, subject.isLoaded());
			
			subject.setIsLoaded(false);
			assert.equal(false, subject.isLoaded());
			
			subject.setIsLoaded(true);
			assert.equal(true, subject.isLoaded());
		});
	});
});