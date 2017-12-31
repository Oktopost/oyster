const root = require('../../../index');
const assert = require('chai').assert;


const inherit	= root.Classy.inherit;
const foreach	= root.Plankton.foreach;
const func		= root.Plankton.func;
const obj		= root.Plankton.obj;

const Action			= root.Oyster.Action;
const Application		= root.Oyster.Application;
const ActionChain		= root.Oyster.Actions.ActionChain;
const ActionChainLink	= root.Oyster.Actions.ActionChainLink;
const TreeActionsModule	= root.Oyster.Modules.Routing.TreeActionsModule;
const ActionEvents		= root.Oyster.Modules.Routing.TreeActions.ActionEvents;
const ModuleController	= root.Oyster.Modules.Utils.ModuleController;

const ActionRoute		= root.Oyster.Routing.ActionRoute;

const Route				= root.SeaRoute.Route.Route;


suite('ActionChain', () => 
{
	function newRoute()
	{
		return new Route('/a', () => {});
	}
	
	function newActionRoute(actions, params)
	{
		var route = new ActionRoute();
		route.setActions(actions || [PlainAction], params || [[]]);
		route.setRoute(newRoute());
		return route;
	}
	
	function createNewConstructor(methods)
	{
		function ActionConstructor()
		{
			Action.call(this);
			
			foreach.pair(methods || [], this, function (name, callback)
			{
				this[name] = callback;
			});
		}
		
		inherit(ActionConstructor, Action);
		
		return ActionConstructor;
	}
	
	function prepareNewConstructor(name, stack)
	{
		return createNewConstructor({
			events:		() => { return new ActionEvents() },
			initialize: function (a, b) { stack.push(['initialize', name, a, b]); },
			refresh: 	function (a, b) { stack.push(['refresh', name, a, b]); },
			execute: 	function (a, b) { stack.push(['execute', name, a, b]); },
			update:		function (a, b) { stack.push(['update', name, a, b]); },
			activate:	function (a, b) { stack.push(['activate', name, a, b]); },
			preDestroy:	function (a, b) { stack.push(['preDestroy', name, a, b]); },
			destroy:	function (a, b) { stack.push(['destroy', name, a, b]); }
		});
	}
	
	function createModule()
	{
		var module = new TreeActionsModule();
		module.setController(new ModuleController(new Application(), 'a'));
		module._navigator = { goto: () => {} };
		return module;
	}
	
	function createSubject()
	{
		return new ActionChain(createModule())
	}
	
	
	var PlainAction = createNewConstructor();
	var PlainActionB = createNewConstructor();
	var PlainActionC = createNewConstructor();
	
	
	test('constructor', () =>
	{
		var subject = createSubject();
		
		assert.deepEqual(subject.chain(), []);
		assert.deepEqual(subject.params(), {});
		assert.isNull(subject.route());
	});
	
	
	suite('update', () =>
	{
		test('navigator passed to Action', () => 
		{
			var isCalled = false;
			var module = createModule();
			module._navigator = { goto: () => { isCalled = true; } };
			
			var subject = new ActionChain(module);
			
			var route = newActionRoute();
			
			
			subject.update(route, {});
			
			
			subject.chain()[0].action().navigate('a', {});
			assert.isTrue(isCalled);
		});
		
		test('module manager passed to Action', () => 
		{
			var module = createModule();
			
			var subject = new ActionChain(module);
			var route = newActionRoute();
			
			subject.update(route, {});
			
			var manager = subject.chain()[0].action().modules();
			assert.strictEqual(manager, module.manager());
		});
		
		test('LifeTime object bounded to module', () => 
		{
			var module = createModule();
			
			var subject = new ActionChain(module);
			var route = newActionRoute();
			
			subject.update(route, {});
			
			var action = subject.chain()[0].action();
			assert.strictEqual(action.getLifeTimeNode().parent(), module.getLifeTimeNode());
		});
		
		
		suite('Chain State', () => 
		{
			test('New params set', () => 
			{
				var subject = createSubject();
				var route = newActionRoute();
				
				subject.update(route, { a: 1, c: 2 });
				
				assert.deepEqual(subject.params(), { a: 1, c: 2 });
			});
			
			test('New params set when update called more then once', () => 
			{
				var subject = createSubject();
				var route = newActionRoute();
				
				subject.update(newActionRoute(), { a: 1, c: 2 });
				subject.update(route, { a: 4, c: 5 });
				
				assert.deepEqual(subject.params(), { a: 4, c: 5 });
			});
			
			test('Route set', () => 
			{
				var subject = createSubject();
				var actionRoute = newActionRoute();
				
				subject.update(actionRoute, {});
				
				assert.strictEqual(subject.route(), actionRoute);
			});
			
			test('Route set when update called more then once', () => 
			{
				var subject = createSubject();
				var actionRoute = newActionRoute();
				
				subject.update(newActionRoute(), {});
				subject.update(actionRoute, {});
				
				assert.strictEqual(subject.route(), actionRoute);
			});
			
			test('Chain updated', () => 
			{
				var subject = createSubject();
				
				subject.update(newActionRoute(), {});
				
				assert.equal(subject.chain().length, 1);
			});
			
			test('Chain updated after update called more then once', () => 
			{
				var subject = createSubject();
				
				subject.update(newActionRoute(), {});
				subject.update(newActionRoute([PlainAction, PlainActionB], [[],[]]), {});
				
				assert.equal(subject.chain().length, 2);
			});
		});
		
		
		suite('Links State', () => 
		{
			test('Single action, chain structure is correct', () => 
			{
				var subject = createSubject();
				var actionRoute = newActionRoute();
				
				subject.update(actionRoute, {});
				
				assert.equal(subject.chain().length, 1);
				assert.instanceOf(subject.chain()[0], ActionChainLink);
				assert.instanceOf(subject.chain()[0].action(), PlainAction);
				assert.isTrue(subject.chain()[0].isMounted());
				assert.isFalse(subject.chain()[0].hasParent());
				assert.isFalse(subject.chain()[0].hasChild());				
			});
			
			test('Two actions, chain structure is correct', () => 
			{
				var subject = createSubject();
				var actionRoute = newActionRoute([PlainAction, PlainActionB], [[],[]]);
				
				subject.update(actionRoute, {});
				
				assert.equal(subject.chain().length, 2);
				
				assert.instanceOf(subject.chain()[0], ActionChainLink);
				assert.instanceOf(subject.chain()[0].action(), PlainAction);
				assert.isTrue(subject.chain()[0].isMounted());
				assert.isFalse(subject.chain()[0].hasParent());
				assert.strictEqual(subject.chain()[0].child(), subject.chain()[1]);
				
				assert.instanceOf(subject.chain()[1], ActionChainLink);
				assert.instanceOf(subject.chain()[1].action(), PlainActionB);
				assert.isTrue(subject.chain()[1].isMounted());
				assert.strictEqual(subject.chain()[1].parent(), subject.chain()[0]);	
				assert.isFalse(subject.chain()[1].hasChild());
			});
			
			test('Multiple actions, chain structure is correct', () => 
			{
				var subject = createSubject();
				var actionRoute = newActionRoute([PlainAction, PlainActionB, PlainActionC], [[],[],[]]);
				
				subject.update(actionRoute, {});
				
				assert.equal(subject.chain().length, 3);
				
				assert.instanceOf(subject.chain()[1], ActionChainLink);
				assert.instanceOf(subject.chain()[1].action(), PlainActionB);
				assert.isTrue(subject.chain()[1].isMounted());
				assert.strictEqual(subject.chain()[1].parent(), subject.chain()[0]);
				assert.strictEqual(subject.chain()[1].child(), subject.chain()[2]);
			});
			
			test('Chain updated on consecutive calls', () => 
			{
				var subject = createSubject();
				
				subject.update(newActionRoute([PlainAction, PlainActionB, PlainActionC], [[],[],[]]), {});
				subject.update(newActionRoute([PlainActionC, PlainAction], [[],[]]), {});
				
				assert.equal(subject.chain().length, 2);
				
				
				assert.instanceOf(subject.chain()[0], ActionChainLink);
				assert.instanceOf(subject.chain()[0].action(), PlainActionC);
				
				assert.instanceOf(subject.chain()[1], ActionChainLink);
				assert.instanceOf(subject.chain()[1].action(), PlainAction);
			});
			
			test('Old chain dismounted', () => 
			{
				var subject = createSubject();
				
				subject.update(newActionRoute([PlainAction], [[],[],[]]), {});
				var chain = subject.chain().concat();
				subject.update(newActionRoute([PlainActionC], [[],[]]), {});
				
				assert.isFalse(chain[0].isMounted());
			});
		});
	});
	
	suite('sanity', () => 
	{
		test('First load', () =>
		{
			var called = [];
			var BuilderA = prepareNewConstructor('A', called);
			var BuilderB = prepareNewConstructor('B', called);
			
			var subject = createSubject();
			var actionRoute = newActionRoute([BuilderA, BuilderB], [[], ['a']]);
			
			subject.update(actionRoute, { a: 1 });
			
			assert.deepEqual(called,
				[
					['initialize', 'A', { a: 1 }, {}],
					['initialize', 'B', { a: 1 }, {}],
					['activate', 'A', { a: 1 }, {}],
					['execute', 'A', { a: 1 }, {}],
					['activate', 'B', { a: 1 }, {}],
					['execute', 'B', { a: 1 }, {}],
				]);
		});
		
		test('Reload same actions with same params', () =>
		{
			var called = [];
			var BuilderA = prepareNewConstructor('A', called);
			var BuilderB = prepareNewConstructor('B', called);
			
			var subject = createSubject();
			var actionRoute = newActionRoute([BuilderA, BuilderB], [[], []]);
			
			subject.update(actionRoute, { a: 1 });
			called.splice(0);
			subject.update(actionRoute, { a: 2 });
			
			assert.deepEqual(called,
				[
					['refresh', 'A', { a: 2 }, { a: 1 }],
					['refresh', 'B', { a: 2 }, { a: 1 }],
				]);
		});
		
		test('Reload actions with different params', () =>
		{
			var called = [];
			var BuilderA = prepareNewConstructor('A', called);
			var BuilderB = prepareNewConstructor('B', called);
			
			var subject = createSubject();
			var actionRoute = newActionRoute([BuilderA, BuilderB], [[], ['a']]);
			
			subject.update(actionRoute, { a: 1 });
			called.splice(0);
			subject.update(actionRoute, { a: 2 });
			
			assert.deepEqual(called,
				[
					['refresh', 'A', { a: 2 }, { a: 1 }],
					['update', 'B', { a: 2 }, { a: 1 }],
					['execute', 'B', { a: 2 }, { a: 1 }],
				]);
		});
		
		test('Add new Action', () =>
		{
			var called = [];
			var BuilderA = prepareNewConstructor('A', called);
			var BuilderB = prepareNewConstructor('B', called);
			var BuilderC = prepareNewConstructor('C', called);
			
			var subject = createSubject();
			var actionRouteA = newActionRoute([BuilderA, BuilderB], [[], []]);
			var actionRouteB = newActionRoute([BuilderA, BuilderB, BuilderC], [[], [], []]);
			
			subject.update(actionRouteA, { a: 1 });
			called.splice(0);
			subject.update(actionRouteB, { a: 2 });
			
			assert.deepEqual(called,
				[
					['initialize', 'C', { a: 2 }, { a: 1 }],
					
					['refresh', 'A', { a: 2 }, { a: 1 }],
					['refresh', 'B', { a: 2 }, { a: 1 }],
					
					['activate', 'C', { a: 2 }, { a: 1 }],
					['execute', 'C', { a: 2 }, { a: 1 }],
				]);
		});
		
		test('Add new Action and modifiy params', () =>
		{
			var called = [];
			var BuilderA = prepareNewConstructor('A', called);
			var BuilderB = prepareNewConstructor('B', called);
			var BuilderC = prepareNewConstructor('C', called);
			
			var subject = createSubject();
			var actionRouteA = newActionRoute([BuilderA, BuilderB], [[], ['a']]);
			var actionRouteB = newActionRoute([BuilderA, BuilderB, BuilderC], [[], ['a'], ['a']]);
			
			subject.update(actionRouteA, { a: 1 });
			called.splice(0);
			subject.update(actionRouteB, { a: 2 });
			
			assert.deepEqual(called,
				[
					['initialize', 'C', { a: 2 }, { a: 1 }],
					
					['refresh', 'A', { a: 2 }, { a: 1 }],
					
					['update', 'B', { a: 2 }, { a: 1 }],
					['execute', 'B', { a: 2 }, { a: 1 }],
					
					['activate', 'C', { a: 2 }, { a: 1 }],
					['execute', 'C', { a: 2 }, { a: 1 }],
				]);
		});
		
		test('Remove action', () =>
		{
			var called = [];
			var BuilderA = prepareNewConstructor('A', called);
			var BuilderB = prepareNewConstructor('B', called);
			
			var subject = createSubject();
			var actionRouteA = newActionRoute([BuilderA, BuilderB], [[], []]);
			var actionRouteB = newActionRoute([BuilderA], [[]]);
			
			subject.update(actionRouteA, { a: 1 });
			called.splice(0);
			subject.update(actionRouteB, { a: 2 });
			
			return func.async.do(() => 
				{
					assert.deepEqual(called,
						[
							['preDestroy', 'B', { a: 2 }, { a: 1 }],
							['refresh', 'A', { a: 2 }, { a: 1 }],
							['destroy', 'B', { a: 2 }, { a: 1 }],
							
						]);
				});
		});
		
		test('Remove action and change params', () =>
		{
			var called = [];
			var BuilderA = prepareNewConstructor('A', called);
			var BuilderB = prepareNewConstructor('B', called);
			
			var subject = createSubject();
			var actionRouteA = newActionRoute([BuilderA, BuilderB], [['a'], ['a']]);
			var actionRouteB = newActionRoute([BuilderA], [['a']]);
			
			subject.update(actionRouteA, { a: 1 });
			called.splice(0);
			subject.update(actionRouteB, { a: 2 });
			
			return func.async.do(() => 
				{
					assert.deepEqual(called,
						[
							['preDestroy', 'B', { a: 2 }, { a: 1 }],
							['update', 'A', { a: 2 }, { a: 1 }],
							['execute', 'A', { a: 2 }, { a: 1 }],
							['destroy', 'B', { a: 2 }, { a: 1 }],
							
						]);
				});
		});
		
		test('Replace action', () =>
		{
			var called = [];
			var BuilderA = prepareNewConstructor('A', called);
			var BuilderB = prepareNewConstructor('B', called);
			var BuilderC = prepareNewConstructor('C', called);
			
			var subject = createSubject();
			var actionRouteA = newActionRoute([BuilderA, BuilderB], [[], ['a']]);
			var actionRouteB = newActionRoute([BuilderA, BuilderC], [[], ['a']]);
			
			subject.update(actionRouteA, { a: 1 });
			called.splice(0);
			subject.update(actionRouteB, { a: 2 });
			
			return func.async.do(() => 
				{
					assert.deepEqual(called,
						[
							['preDestroy', 'B', { a: 2 }, { a: 1 }],
							['initialize', 'C', { a: 2 }, { a: 1 }],
							['refresh', 'A', { a: 2 }, { a: 1 }],
							['activate', 'C', { a: 2 }, { a: 1 }],
							['execute', 'C', { a: 2 }, { a: 1 }],
							['destroy', 'B', { a: 2 }, { a: 1 }],
							
						]);
				});
		});
		
		test('Complex stracture', () =>
		{
			var called = [];
			var BuilderA = prepareNewConstructor('A', called);
			var BuilderB = prepareNewConstructor('B', called);
			var BuilderC = prepareNewConstructor('C', called);
			var BuilderD = prepareNewConstructor('D', called);
			var BuilderE = prepareNewConstructor('E', called);
			var BuilderF = prepareNewConstructor('F', called);
			
			var subject = createSubject();
			var actionRouteA = newActionRoute([BuilderA, BuilderB, BuilderC, BuilderD], [['a'], ['a', 'b'], ['a', 'b'], ['a', 'b']]);
			var actionRouteB = newActionRoute([BuilderA, BuilderB, BuilderE, BuilderF], [['a'], ['a', 'b'], ['a', 'b'], ['a', 'b']]);
			
			subject.update(actionRouteA, { a: 2 });
			called.splice(0);
			subject.update(actionRouteB, { a: 2, b: 3 });
			
			return func.async.do(() => 
				{
					assert.deepEqual(called,
						[
							['preDestroy', 'C', { a: 2, b: 3 }, { a: 2 }],
							['preDestroy', 'D', { a: 2, b: 3 }, { a: 2 }],
							
							['initialize', 'E', { a: 2, b: 3 }, { a: 2 }],
							['initialize', 'F', { a: 2, b: 3 }, { a: 2 }],
							
							['refresh', 'A', { a: 2, b: 3 }, { a: 2 }],
							
							['update', 'B', { a: 2, b: 3 }, { a: 2 }],
							['execute', 'B', { a: 2, b: 3 }, { a: 2 }],
							
							['activate', 'E', { a: 2, b: 3 }, { a: 2 }],
							['execute', 'E', { a: 2, b: 3 }, { a: 2 }],
							['activate', 'F', { a: 2, b: 3 }, { a: 2 }],
							['execute', 'F', { a: 2, b: 3 }, { a: 2 }],
							
							['destroy', 'C', { a: 2, b: 3 }, { a: 2 }],
							['destroy', 'D', { a: 2, b: 3 }, { a: 2 }],
							
						]);
				});
		});
	});
});