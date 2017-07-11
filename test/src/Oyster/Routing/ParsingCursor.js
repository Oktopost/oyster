const root = require('../../../index');
const assert = require('chai').assert;


const ActionRoute	= root.Oyster.Routing.ActionRoute;
const ParsingCursor = root.Oyster.Routing.ParsingCursor;


suite.only('ParsingCursor', () => 
{
	suite('parseRouteConfig', () => 
	{
		test('Path Build correctly', () => 
		{
			var subject = new ParsingCursor({});
			
			subject.parseRouteConfig({ action: {}, path: '/a' });
			subject.parseRouteConfig({ action: {}, path: 'b/' });
			subject.parseRouteConfig({ action: {}, path: '/' });
			subject.parseRouteConfig({ action: {}, path: '/{c}/' });
			subject.parseRouteConfig({ action: {}, path: 'e/f' });
			subject.parseRouteConfig({ action: {}, path: '' });
			
			var res = subject.parseRouteConfig({ action: {}, path: 'd' });
			
			assert.equal('/a/b/{c}/e/f/d', res.route().path().text());
		});
		
		
		suite('First call', () =>
		{
			test('ActionRoute Returned', () => 
			{
				var subject = new ParsingCursor({});
				var res = subject.parseRouteConfig({
					action: {},
					path: 'a'
				});
				
				assert.instanceOf(res, ActionRoute);
			});
			
			test('Action passed to ActionRoute', () => 
			{
				var subject = new ParsingCursor({});
				var action = function() {};
				
				var res = subject.parseRouteConfig({
					action: action,
					path: 'a'
				});
				
				assert.deepEqual([action], res.actions());
			});
			
			test('Route passed to ActionRoute', () => 
			{
				var subject = new ParsingCursor({});
				var action = function() {};
				
				var res = subject.parseRouteConfig({
					action: action,
					path: 'a'
				});
				
				assert.equal('/a', res.route().path().text());
			});
			
			test('Params passed to ActionRoute', () => 
			{
				var subject = new ParsingCursor({});
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
				var subject = new ParsingCursor({});
				
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
				var subject = new ParsingCursor({});
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
				var subject = new ParsingCursor({});
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
				var subject = new ParsingCursor({});
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
			var subject = new ParsingCursor({});
			
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
			var subject = new ParsingCursor({});
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
			var subject = new ParsingCursor({});
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
			var subject = new ParsingCursor({});
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