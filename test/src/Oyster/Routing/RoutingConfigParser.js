const root = require('../../../index');
const assert = require('chai').assert;


const ActionRoute			= root.Oyster.Routing.ActionRoute;
const RoutingConfigParser	= root.Oyster.Routing.RoutingConfigParser;


suite('RoutingConfigParser', () => 
{
	suite('parse', () => 
	{
		test('empty config, return empty result', () => 
		{
			var res = RoutingConfigParser.parse({}, {});
			assert.deepEqual(res, {});
		});
		
		test('empty config with deep levels, return empty result', () => 
		{
			var res = RoutingConfigParser.parse({}, { a: {}, b: {c: {}}}, {});
			assert.deepEqual(res, { a: {}, b: { c: {} } });
		});
		
		test('single route defined', () => 
		{
			var res = RoutingConfigParser.parse({}, { $: { action: () => {}, path: '' } }, {});
			
			assert.instanceOf(res['$'], ActionRoute);
			assert.instanceOf(res['$'], ActionRoute);
		});
		
		test('single route defined using the "route" keyword', () => 
		{
			var res = RoutingConfigParser.parse({}, { route: { action: () => {}, path: '' } }, {});
			
			assert.instanceOf(res['$'], ActionRoute);
			assert.instanceOf(res['$'], ActionRoute);
		});
		
		test('route with children', () => 
		{
			var res = RoutingConfigParser.parse({}, 
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
				{});
			
			assert.instanceOf(res['$'], ActionRoute);
			assert.instanceOf(res['b']['$'], ActionRoute);
		});
		
		test('number of routes', () => 
		{
			var res = RoutingConfigParser.parse({}, 
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
				{});
			
			assert.instanceOf(res['b']['$'], ActionRoute);
			assert.instanceOf(res['c']['$'], ActionRoute);
		});
		
		test('number of routes, correct paths used', () => 
		{
			var res = RoutingConfigParser.parse({}, 
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
				{});
			
			assert.instanceOf(res['b']['$'], ActionRoute);
			assert.instanceOf(res['b']['bb']['$'], ActionRoute);
			assert.equal(res['b']['bb']['$'].route().path().text(), '/b/bb');
			
			assert.instanceOf(res['c']['$'], ActionRoute);
			assert.instanceOf(res['c']['cc']['$'], ActionRoute);
			assert.equal(res['c']['cc']['$'].route().path().text(), '/c/cc');
		});
	});
});