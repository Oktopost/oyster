const root = require('../../../index');
const assert = require('chai').assert;


const func			= root.Plankton.func;
const Route			= root.SeaRoute.Route.Route;
const Router		= root.SeaRoute.Router;
const Navigator		= root.Oyster.Routing.Navigator;
const ActionRoute	= root.Oyster.Routing.ActionRoute;


suite('Navigator', () => 
{
	suite('link', () => 
	{
		test('Value returned', () => 
		{
			var router = new Router();
			router.link = function() { return 'result' };
			
			var subject = new Navigator(router);
			
			assert.equal(subject.link('a', {a: 1}), 'result');
		});
		
		test('Invalid input, Error thrown', () => 
		{
			var original = console.error;
			
			try
			{
				console.error = () => {};
				
				var subject = new Navigator(new Router());
				
				assert.throws(() => 
				{
					subject.link({}, {});
				});
			}
			finally 
			{
				console.error = original;
			}
		});
		
		test('Pass string, string passed to router', () => 
		{
			var calledWith = null;
			var router = new Router();
			router.link = function(a, b) { calledWith = [a, b]; };
			
			var subject = new Navigator(router);
			
			subject.link('a', {a: 1});
			
			assert.deepEqual(calledWith, ['a', {a: 1}]);
		});
		
		test('Pass Route, Route passed to router', () => 
		{
			var calledWith = null;
			var route = new Route();
			var router = new Router();
			router.link = function(a, b) { calledWith = [a, b]; };
			
			var subject = new Navigator(router);
			
			subject.link(route, {a: 1});
			
			assert.deepEqual(calledWith, [route, {a: 1}]);
		});
		
		test('Pass ActionRoute, Route passed to router', () => 
		{
			var calledWith = null;
			var actionRoute = new ActionRoute();
			var route = new Route();
			var router = new Router();
			
			actionRoute.setRoute(route);
			router.link = function(a, b) { calledWith = [a, b]; };
			
			var subject = new Navigator(router);
			
			subject.link(actionRoute, {a: 1});
			
			assert.deepEqual(calledWith, [route, {a: 1}]);
		});
		
		test('Pass Routing setup, Route passed to router', () => 
		{
			var calledWith = null;
			var actionRoute = new ActionRoute();
			var route = new Route();
			var router = new Router();
			
			actionRoute.setRoute(route);
			router.link = function(a, b) { calledWith = [a, b]; };
			
			var subject = new Navigator(router);
			
			subject.link({ $: actionRoute }, {a: 1});
			
			assert.deepEqual(calledWith, [route, {a: 1}]);
		});
	});
	
	suite('goto', () => 
	{
		test('Pass string, string passed to router', () => 
		{
			var calledWith = null;
			var router = new Router();
			router.navigate = function(a, b) { calledWith = [a, b]; };
			
			var subject = new Navigator(router);
			
			return subject.goto('a', {a: 1})
				.then(() => { assert.deepEqual(calledWith, ['a', {a: 1}]); });
		});
		
		test('Pass Route, Route passed to router', () => 
		{
			var calledWith = null;
			var route = new Route();
			var router = new Router();
			router.navigate = function(a, b) { calledWith = [a, b]; };
			
			var subject = new Navigator(router);
			
			return subject.goto(route, {a: 1})
				.then(() => { assert.deepEqual(calledWith, [route, {a: 1}]) });
		});
		
		test('Pass ActionRoute, Route passed to router', () => 
		{
			var calledWith = null;
			var actionRoute = new ActionRoute();
			var route = new Route();
			var router = new Router();
			
			actionRoute.setRoute(route);
			router.navigate = function(a, b) { calledWith = [a, b]; };
			
			var subject = new Navigator(router);
			
			return subject.goto(actionRoute, {a: 1})
				.then(() => { assert.deepEqual(calledWith, [route, {a: 1}]); });
		});
		
		test('Pass Routing setup, Route passed to router', () => 
		{
			var calledWith = null;
			var actionRoute = new ActionRoute();
			var route = new Route();
			var router = new Router();
			
			actionRoute.setRoute(route);
			router.navigate = function(a, b) { calledWith = [a, b]; };
			
			var subject = new Navigator(router);
			
			return subject.goto({ $: actionRoute }, {a: 1})
				.then(() => { assert.deepEqual(calledWith, [route, {a: 1}]); });
		});
		
		test('Called number of times, only the last one applied', () => 
		{
			var calledWith = null;
			var router = new Router();
			router.navigate = function(a, b) { calledWith = [a, b]; };
			
			var subject = new Navigator(router);
			
			subject.goto('b', {b: 2});
			
			return subject.goto('a', {a: 1})
				.then(() => 
				{
					return func.async.do(() => 
					{
						assert.deepEqual(calledWith, ['a', {a: 1}]);
					});
				});
		});
	});
});