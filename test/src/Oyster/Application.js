const root = require('../../index');
const assert = require('chai').assert;


const func		= root.Plankton.func;
const inherit	= root.Classy.inherit;

const Application		= root.Oyster.Application;
const ModuleManager		= root.Oyster.ModuleManager;

const BaseRoutingModule		= root.Oyster.Modules.BaseRoutingModule;
const BaseNavigationModule	= root.Oyster.Modules.BaseNavigationModule;


suite('Application', () => 
{
	test('run', () =>
	{
		var calledWith;
		var app = new Application();
		var module = new BaseRoutingModule();
		
		global.window = { location: { pathname: '/ma/url', search: '' } };
		app.modules().add(module);
		module.handleURL = (a) => { calledWith = a; };
		
		app.run();
		
		return (func.postponed(() => { assert.equal(calledWith, '/ma/url'); }, 1))();
	});
	
	
	suite('create', () => 
	{
		test('Application instance returned', () => 
		{
			var res = Application.create(
				[
					BaseRoutingModule,
					BaseNavigationModule
				], 
				function (app) {});
			
			assert.instanceOf(res, Application);
		});
		
		test('Application passed to modules manager', () => 
		{
			var res = Application.create(
				[
					BaseRoutingModule,
					BaseNavigationModule
				], 
				function (app) {});
			
			assert.strictEqual(res.modules()._app, res);
		});
		
		test('Application passed to callback', () => 
		{
			var calledApp;
			var res = Application.create(
				[
					BaseRoutingModule,
					BaseNavigationModule
				], 
				function (app)
				{
					calledApp = app;
				});
			
			return (func.postponed(() => 
				{ 
					assert.equal(calledApp, res);
				}, 
				1))();
		});
		
		test('Router module passed to callback', () => 
		{
			var calledModule;
			
			Application.create(
				[
					BaseRoutingModule,
					BaseNavigationModule
				], 
				function (a, module)
				{
					calledModule = module;
				});
			
			return (func.postponed(() => 
				{ 
					assert.instanceOf(calledModule, BaseRoutingModule);
				}, 
				1))();
		});
	});
	
	
	suite('modules', () =>
	{
		test('Pass string, return module by name', () => 
		{
			var app = new Application();
		
			function NavModule() {}
			inherit(NavModule, BaseNavigationModule);
			
			app.modules().add(new NavModule());
			
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
			
			app.modules(new NavModule());
			
			return (func.postponed(() => 
			{
				assert.isTrue(app.modules().has(BaseNavigationModule));
			}, 1))();
		});
		
		test('Pass constructor with moduleName function, instance returned', () => 
		{
			var app = new Application();
		
			function NavModule() {}
			inherit(NavModule, BaseNavigationModule);
			NavModule.moduleName = BaseNavigationModule.moduleName;
			
			app.modules().add(new NavModule());
			
			return (func.postponed(() => 
			{
				assert.instanceOf(app.modules(NavModule), BaseNavigationModule);
			}, 1))();
		});
		
		test('Pass constructor with moduleName string, instance returned', () => 
		{
			var app = new Application();
		
			function NavModule() {}
			inherit(NavModule, BaseNavigationModule);
			NavModule.moduleName = BaseNavigationModule.moduleName();
			
			app.modules().add(new NavModule());
			
			return (func.postponed(() => 
			{
				assert.instanceOf(app.modules(NavModule), BaseNavigationModule);
			}, 1))();
		});
		
		test('Pass constructor with invalid moduleName, module added', () => 
		{
			var app = new Application();
		
			function NavModule() {}
			inherit(NavModule, BaseNavigationModule);
			NavModule.moduleName = 2;
			
			app.modules(NavModule);
			
			return (func.postponed(() => 
			{
				assert.isTrue(app.modules().has(BaseNavigationModule));
			}, 1))();
		});
		
		test('Pass nothing, manager returned', () => 
		{
			var app = new Application();
			assert.instanceOf(app.modules(), ModuleManager);
		});
	});
	
	suite('_getBaseUrl', () =>
	{
		test('Get base URL if it is not set', () =>
		{
			var app = new Application();
			app._baseUrl = null;
			global.window = { location: { pathname: '/abc', search: 'def' } };
			
			baseUrl = app._getBaseUrl();
			
			assert.equal(baseUrl, '/abcdef');
		});
		
		test('Process base URL if it is a function', () =>
		{
			var app = new Application();
			app._baseUrl = () => {};
			
			baseUrl = app._getBaseUrl();
			
			assert.equal(baseUrl, app._baseUrl());
		});
		
		test('Process base URL if it is a string', () =>
		{
			var app = new Application();
			app._baseUrl = '/abc';
			
			baseUrl = app._getBaseUrl();
			
			assert.equal(baseUrl, '/abc');
		});
		
		test('Process base URL if it is a number', () =>
		{
			var app = new Application();
			app._baseUrl = 5;
			
			baseUrl = app._getBaseUrl();
			
			assert.equal(baseUrl, '5');
		});
		
		test('Process base URL if it is an object', () =>
		{
			var app = new Application();
			app._baseUrl = {a: 'b'};
			
			baseUrl = app._getBaseUrl();
			
			assert.equal(baseUrl, '[object Object]');
		});
		
		test('Process base URL if it does not have toString method', () =>
		{
			var app = new Application();
			app._baseUrl = {toString: null};
			
			baseUrl = app._getBaseUrl();
			
			assert.equal(baseUrl, '/');
		});
	});
	
	
	test('Set base URL', () =>
	{
		var app = new Application();
		
		app.setBaseUrl('/abc');
		
		assert.equal(app._baseUrl, '/abc');
	});
});