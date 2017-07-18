const root = require('../../../index');
const assert = require('chai').assert;


const obj = root.Plankton.obj;

const Application			= root.Oyster.Application;

const ActionRoute			= root.Oyster.Routing.ActionRoute;
const RoutingConfigParser	= root.Oyster.Routing.RoutingConfigParser;

const RoutesBuilder			= root.SeaRoute.RoutesBuilder;

const TreeActionsModule		= root.Oyster.Modules.Routing.TreeActionsModule;
const BaseNavigationModule	= root.Oyster.Modules.BaseNavigationModule;


suite('RoutingConfigParser', () => 
{
	/**
	 * @param mixin
	 * @return {TreeActionsModule}
	 */
	function manager(mixin)
	{
		var actionsModule = new TreeActionsModule();
		
		actionsModule.manager = () => { return { get: () => new BaseNavigationModule() } };
		actionsModule.app = () => { return new  Application(); };
		actionsModule.preLoad();
		
		return obj.mix(actionsModule, mixin || {});
	}
	
	
	suite('parse', () => 
	{
		function builder() 
		{
			return new RoutesBuilder();
		}
		
		
		test('empty config, return empty result', () => 
		{
			var res = RoutingConfigParser.parse(manager(), {}, builder());
			assert.deepEqual(res, {});
		});
		
		test('empty config with deep levels, return empty result', () => 
		{
			var res = RoutingConfigParser.parse(manager(), { a: {}, b: {c: {}}}, builder());
			assert.deepEqual(res, { a: {}, b: { c: {} } });
		});
		
		test('single route defined', () => 
		{
			var res = RoutingConfigParser.parse(manager(), { $: { action: () => {}, path: '' } }, builder());
			
			assert.instanceOf(res['$'], ActionRoute);
			assert.instanceOf(res['$'], ActionRoute);
		});
		
		test('single route defined using the "route" keyword', () => 
		{
			var res = RoutingConfigParser.parse(manager(), { route: { action: () => {}, path: '' } }, builder());
			
			assert.instanceOf(res['$'], ActionRoute);
			assert.instanceOf(res['$'], ActionRoute);
		});
		
		test('single route defined using the "_" character', () => 
		{
			var res = RoutingConfigParser.parse(manager(), { _: { action: () => {}, path: '' } }, builder());
			
			assert.instanceOf(res['$'], ActionRoute);
		});
		
		test('route defined using the "_" character not added to the router', () => 
		{
			var isCalled = false;
			var m = manager({
				router: function ()
				{
					return {
						appendRoutes: function(target) { isCalled = true; }
					}
				}
			});
			
			var res = RoutingConfigParser.parse(m, { _: { action: () => {}, path: '' } }, builder());
			
			assert.isFalse(isCalled);
		});
		
		test('route with children', () => 
		{
			var res = RoutingConfigParser.parse(manager(), 
				{
					$: 
					{ 
						action: () => {},
						path: 'a'
					},
					
					b:
					{
						$: 
						{ 
							action: () => {},
							path: 'b'
						},
					}
				}, 
				builder());
			
			assert.instanceOf(res['$'], ActionRoute);
			assert.instanceOf(res['b']['$'], ActionRoute);
		});
		
		test('number of routes', () => 
		{
			var res = RoutingConfigParser.parse(manager(), 
				{
					b:
					{
						$: 
						{ 
							action: () => {},
							path: 'b'
						},
					},
					c:
					{
						$: 
						{ 
							action: () => {},
							path: 'c'
						},
					}
				}, 
				builder());
			
			assert.instanceOf(res['b']['$'], ActionRoute);
			assert.instanceOf(res['c']['$'], ActionRoute);
		});
		
		test('number of routes, correct paths used', () => 
		{
			var res = RoutingConfigParser.parse(manager(), 
				{
					b:
					{
						$: 
						{ 
							action: () => {},
							path: 'b'
						},
						bb:
						{
							$: 
							{ 
								action: () => {},
								path: 'bb'
							}
						}
					},
					c:
					{
						$: 
						{ 
							action: () => {},
							path: 'c'
						},
						cc:
						{
							$: 
							{ 
								action: () => {},
								path: 'cc'
							}
						}
					}
				}, 
				builder());
			
			assert.instanceOf(res['b']['$'], ActionRoute);
			assert.instanceOf(res['b']['bb']['$'], ActionRoute);
			assert.equal(res['b']['bb']['$'].route().path().text(), '/b/bb');
			
			assert.instanceOf(res['c']['$'], ActionRoute);
			assert.instanceOf(res['c']['cc']['$'], ActionRoute);
			assert.equal(res['c']['cc']['$'].route().path().text(), '/c/cc');
		});
	});
});