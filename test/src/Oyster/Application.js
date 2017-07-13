const root = require('../../index');
const assert = require('chai').assert;


const func		= root.Plankton.func;
const inherit	= root.Classy.inherit;

const ActionsManager	= root.Oyster.ActionsManager;
const ModuleManager		= root.Oyster.ModuleManager;
const Application		= root.Oyster.Application;

const BaseNavigationModule	= root.Oyster.Modules.BaseNavigationModule;


suite('Application', () => 
{
	test('Sanity getters', () => 
	{
		var app = new Application();
		
		assert.instanceOf(app.actions(), ActionsManager);
		assert.instanceOf(app.modules(), ModuleManager);
		
		app.actions().setup = () => 123;
		
		assert.equal(123, app.routing());
	});
	
	
	test('run', () => 
	{
		var calledWith;
		var app = new Application();
		
		global.window = { location: { pathname: '/ma/url' } };
		app._actions.handleURL = (a) => { calledWith = a; };
		
		app.run();
		
		return (func.postponed(() => { assert.equal(calledWith, '/ma/url'); }, 1))();
	});
	
	
	test('Navigation module used', () => 
	{
		var app = new Application();
		var called = [];
		
		function NavModule()
		{
			this.navigate = (a) => { called.push(a); };
		}
		
		
		inherit(NavModule, BaseNavigationModule);
		app.modules(NavModule);
		
		
		return (func.postponed(() => 
		{
			app.actions().navigator().goto('/hello/world');
			
			return (func.postponed(() => 
			{
				assert.deepEqual(called, ['/hello/world']);
			}, 1))();
		}, 1))();
	});
	
	test('Navigation module used for miss', () => 
	{
		var app = new Application();
		var called = [];
		
		function NavModule()
		{
			this.handleMiss = (a) => { called.push(a); };
		}
		
		
		inherit(NavModule, BaseNavigationModule);
		app.modules(NavModule);
		
		
		return (func.postponed(() => 
		{
			app.actions().handleURL('/hello/world');
			
			return (func.postponed(() => 
			{
				assert.deepEqual(called, ['/hello/world']);
			}, 1))();
		}, 1))();
	});
	
	
	suite('modules', () =>
	{
		test('Pass string, return module by name', () => 
		{
			var app = new Application();
		
			function NavModule() {}
			inherit(NavModule, BaseNavigationModule);
			
			app.modules().add(NavModule);
			
			return (func.postponed(() => 
			{
				assert.instanceOf(app.modules(BaseNavigationModule.moduleName()), BaseNavigationModule);
			}, 1))();
		});
		
		test('Pass instance, instance added', () => 
		{
			var app = new Application();
		
			function NavModule() {}
			inherit(NavModule, BaseNavigationModule);
			
			app.modules(NavModule);
			
			return (func.postponed(() => 
			{
				assert.isTrue(app.modules().has(BaseNavigationModule));
			}, 1))();
		});
		
		test('Pass nathing, manager returned', () => 
		{
			var app = new Application();
			assert.instanceOf(app.modules(), ModuleManager);
		});
	});
});