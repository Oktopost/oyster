const root = require('../../../../index');
const assert = require('chai').assert;


const obj = root.Plankton.obj;

const Module			= root.Oyster.Module;
const Application		= root.Oyster.Application;
const ModuleController	= root.Oyster.Modules.Utils.ModuleController;


/**
 * @return {Application}
 */
function createApp(managerMix)
{
	managerMix = managerMix || {};
	
	var app = new Application();
	app._modules = obj.merge({}, managerMix);
	return app;
}


suite('ModuleController', () => 
{
	test('name', () => 
	{
		assert.equal('a', (new ModuleController(createApp(), 'a')).name());
	});
	
	test('application', () => 
	{
		var app = createApp();
		assert.equal(app, (new ModuleController(app, 'a')).app());
	});
	
	test('module manager', () => 
	{
		var app = createApp();
		assert.equal(app.modules(), (new ModuleController(app, 'a')).manager());
	});
	
	
	suite('unload', () => 
	{
		test('not loaded, unload not invoked', () => 
		{
			var isCalled = false;
			var app = createApp({ remove: () => { isCalled = true; }});
			
			(new ModuleController(app, 'a')).unload();
			
			assert.equal(false, isCalled);
		});
		
		test('module is loaded, unload invoked', () => 
		{
			var isCalled = false;
			var app = createApp({ remove: () => { isCalled = true; } });
			
			var obj = new ModuleController(app, 'a');
			
			obj.setIsLoaded(true);
			obj.unload();
			
			assert.equal(true, isCalled);
		});
	});
	
	
	suite('isLoaded', () => 
	{
		test('new Object, return false', () => 
		{
			assert.equal(false, (new ModuleController(createApp())).isLoaded());
		});
		
		test('setIsLoaded, return value', () => 
		{
			var subject = new ModuleController(createApp());
			
			subject.setIsLoaded(true);
			assert.equal(true, subject.isLoaded());
			
			subject.setIsLoaded(false);
			assert.equal(false, subject.isLoaded());
			
			subject.setIsLoaded(true);
			assert.equal(true, subject.isLoaded());
		});
	});
});