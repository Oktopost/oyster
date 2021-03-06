const root = require('../../../index');
const assert = require('chai').assert;


const obj				= root.Plankton.obj;
const ActionRoute		= root.Oyster.Routing.ActionRoute;
const ParsingCursor		= root.Oyster.Routing.ParsingCursor;

const TreeActionsModule		= root.Oyster.Modules.Routing.TreeActionsModule;
const BaseNavigationModule	= root.Oyster.Modules.BaseNavigationModule;


suite('ParsingCursor', () => 
{
	function manager(mixin)
	{
		var actionsModule = new TreeActionsModule();
		
		actionsModule.manager = () => { return { get: () => new BaseNavigationModule() } };
		actionsModule.preLoad();
		
		return obj.mix(actionsModule, mixin || {});
	}
	
	
	suite('parseRouteConfig', () => 
	{
		test('Path Build correctly', () => 
		{
			var subject = new ParsingCursor(manager());
			
			subject.parseRouteConfig({ action: {}, path: '/a' });
			subject.parseRouteConfig({ action: {}, path: 'b/' });
			subject.parseRouteConfig({ action: {}, path: '/' });
			subject.parseRouteConfig({ action: {}, path: '/{c}/' });
			subject.parseRouteConfig({ action: {}, path: 'e/f' });
			subject.parseRouteConfig({ action: {}, path: '' });
			
			var res = subject.parseRouteConfig({ action: {}, path: 'd' });
			
			assert.equal('/a/b/{c}/e/f/d', res.route().path().text());
		});
			
		test('Missing path, use empty sting instead', () => 
		{
			var subject = new ParsingCursor(manager());
			
			var res = subject.parseRouteConfig({ action: {} });
			
			assert.equal('/', res.route().path().text());
		});
		
		test('Manager invoked', () => 
		{
			var action;
			var params;
			
			var subject = new ParsingCursor(manager({
				handle: (a, b) =>
				{
					action = a;
					params = b;
				}
			}));
			
			var res = subject.parseRouteConfig({ action: {}, path: '/a' });
			
			res.route().handle('/a', { a: 1 });
			
			assert.strictEqual(action, res);
			assert.deepEqual(params, { a: 1 });
		});
		
		
		suite('Partial route', () => 
		{
			test('Add partial route, route not added to the router', () =>
			{
				var isCalled = false;
				var subject = new ParsingCursor(manager({
					router: function ()
					{
						return {
							appendRoutes: function(target) { isCalled = true; }
						}
					}
				}));
				
				subject.parseRouteConfig({ action: {}, path: '/a' }, true);
				
				assert.isFalse(isCalled);
			});
			
			test('Add partial route, route parsed', () =>
			{
				var subject = new ParsingCursor(manager());
			
				var obj = subject.parseRouteConfig({ action: {}, path: '/a' }, true);
				
				assert.equal('/a', obj.route().path().text());
			});
		});
		
		
		suite('Actionless route', () => 
		{
			test('ActionRoute setup correctly', () =>
			{
				var subject = new ParsingCursor(manager());
			
				subject.parseRouteConfig({ action: {}, path: 'a' });
				subject.parseRouteConfig({ path: 'b' });
				var res = subject.parseRouteConfig({ action: {}, path: 'c' });
				
				assert.equal(res.actions().length, 2);
			});
			
			test('Route setup correctly', () =>
			{
				var subject = new ParsingCursor(manager());
			
				subject.parseRouteConfig({ action: {}, path: 'a' });
				subject.parseRouteConfig({ path: 'b' });
				var res = subject.parseRouteConfig({ action: {}, path: 'c' });
				
				assert.equal('/a/b/c', res.route().path().text());
			});
		});
		
		
		suite('First call', () =>
		{
			test('ActionRoute Returned', () => 
			{
				var subject = new ParsingCursor(manager());
				var res = subject.parseRouteConfig({
					action: {},
					path: 'a'
				});
				
				assert.instanceOf(res, ActionRoute);
			});
			
			test('Action passed to ActionRoute', () => 
			{
				var subject = new ParsingCursor(manager());
				var action = function() {};
				
				var res = subject.parseRouteConfig({
					action: action,
					path: 'a'
				});
				
				assert.deepEqual([action], res.actions());
			});
			
			test('Route passed to ActionRoute', () => 
			{
				var subject = new ParsingCursor(manager());
				var action = function() {};
				
				var res = subject.parseRouteConfig({
					action: action,
					path: 'a'
				});
				
				assert.equal('/a', res.route().path().text());
			});
			
			test('Params passed to ActionRoute', () => 
			{
				var subject = new ParsingCursor(manager());
				var action = function() {};
				
				var res = subject.parseRouteConfig({
					action: action,
					path: 'a',
					params: { 'id': 'int' }
				});
				
				assert.deepEqual([['id']], res.params());
			});
		});
		
		suite('Called more then once', () =>
		{
			test('ActionRoute Returned', () => 
			{
				var subject = new ParsingCursor(manager());
				
				subject.parseRouteConfig({
					action: {},
					path: 'a'
				});
				
				var res = subject.parseRouteConfig({
					action: {},
					path: 'a'
				});
				
				assert.instanceOf(res, ActionRoute);
			});
			
			test('Action passed to ActionRoute', () => 
			{
				var subject = new ParsingCursor(manager());
				var action1 = function() {};
				var action2 = function() {};
				
				subject.parseRouteConfig({
					action: action1,
					path: 'a'
				});
				
				var res = subject.parseRouteConfig({
					action: action2,
					path: 'a'
				});
				
				assert.deepEqual([action1, action2], res.actions());
			});
			
			test('Route passed to ActionRoute', () => 
			{
				var subject = new ParsingCursor(manager());
				var action = function() {};
				
				subject.parseRouteConfig({
					action: action,
					path: 'a'
				});
				
				var res = subject.parseRouteConfig({
					action: action,
					path: 'b'
				});
				
				assert.equal('/a/b', res.route().path().text());
			});
			
			test('Params passed to ActionRoute', () => 
			{
				var subject = new ParsingCursor(manager());
				var action = function() {};
				
				subject.parseRouteConfig({
					action: action,
					path: '{dd}'
				});
				
				var res = subject.parseRouteConfig({
					action: action,
					path: 'a',
					params: { 'id': 'int' }
				});
				
				assert.deepEqual(res.params(), [['dd'], ['dd', 'id']]);
			});
		});
	});
	
	
	suite('pop', () =>
	{
		test('ActionRoute reset correctly', () => 
		{
			var subject = new ParsingCursor(manager());
			
			subject.parseRouteConfig({
				action: {},
				path: 'a'
			});
			
			subject.parseRouteConfig({action: {}, path: 'a'});
			subject.pop();
			
			var res = subject.parseRouteConfig({
				action: {},
				path: 'a'
			});
			
			assert.instanceOf(res, ActionRoute);
		});
		
		test('Actions reset correctly', () => 
		{
			var subject = new ParsingCursor(manager());
			var action1 = function() {};
			var action2 = function() {};
			var action3 = function() {};
			
			subject.parseRouteConfig({
				action: action1,
				path: 'a'
			});
			
			subject.parseRouteConfig({action: action3, path: 'a'});
			subject.pop();
			
			var res = subject.parseRouteConfig({
				action: action2,
				path: 'a'
			});
			
			assert.deepEqual([action1, action2], res.actions());
		});
		
		test('Path reset correctly', () => 
		{
			var subject = new ParsingCursor(manager());
			var action = function() {};
			
			subject.parseRouteConfig({
				action: action,
				path: 'a'
			});
			
			subject.parseRouteConfig({action: action, path: 'b'});
			subject.pop();
			
			var res = subject.parseRouteConfig({
				action: action,
				path: 'c'
			});
			
			assert.equal('/a/c', res.route().path().text());
		});
		
		test('Params reset correctly', () => 
		{
			var subject = new ParsingCursor(manager());
			var action = function() {};
			
			subject.parseRouteConfig({
				action: action,
				path: '{dd}'
			});
			
			subject.parseRouteConfig({action: action, path: '{nnn}' });
			subject.pop();
			
			var res = subject.parseRouteConfig({
				action: action,
				path: 'a',
				params: { 'id': 'int' }
			});
			
			assert.deepEqual(res.params(), [['dd'], ['dd', 'id']]);
		});
	});
});