const root = require('../../index');
const assert = require('chai').assert;


const LifeTime			= root.Duct.LifeTime;
const LifeBindFactory	= root.Duct.LT.LifeBindFactory;

const Action		= root.Oyster.Action;
const Application	= root.Oyster.Application;
const ActionEvents	= root.Oyster.Modules.Routing.TreeActions.ActionEvents;


suite('Action', () => 
{
	test('sanity', () => 
	{
		var subject = new Action();
		
		var chainLink = { a: 1 };
		var params = { b: 2 };
		
		subject.setChainLink(chainLink);
		subject.setParams(params);
		
		assert.deepEqual(subject.params(), params);
		assert.strictEqual(subject.chain(), chainLink);
	});
	
	test('events', () => 
	{
		var subject = new Action();
		
		assert.instanceOf(subject.events(), ActionEvents);
		assert.deepEqual(subject.events(), subject.events());
	});
	
	test('LT', () => 
	{
		var subject = new Action();
		
		assert.instanceOf(subject.LT(), LifeTime);
		assert.deepEqual(subject.LT(), subject.LT());
	});
	
	test('isMounted', () => 
	{
		var subject = new Action();
		
		//noinspection JSValidateTypes
		subject._chainLink = { isMounted: function () { return true; } };
		assert.equal(subject.isMounted(), true);
		
		//noinspection JSValidateTypes
		subject._chainLink = { isMounted: function () { return false; } };
		assert.equal(subject.isMounted(), false);
	});
	
	test('params returns copy', () => 
	{
		var subject = new Action();
		
		var params = { b: 2 };
		
		subject.setParams(params);
		subject.params().b = 3;
		
		assert.deepEqual(subject.params(), params);
	});
	
	test('navigation', () => 
	{
		var called = [];
		
		var subject = new Action();
		
		subject.setNavigator({
			goto: (a, b) => { called.push(a, b); },
			link: (a, b) => { called.push(a, b); return 'hello'; }
		});
		
		subject.navigate('target', {a: 1});
		var link = subject.linkTo('target2', {b: 3});
		
		assert.equal(link, 'hello');
		assert.deepEqual(called, ['target', {a: 1}, 'target2', {b: 3}]);
	});
	
	test('app', () => 
	{
		var subject = new Action();
		var app = new Application();
		
		subject.setChainLink({ app: () => app });
		
		assert.strictEqual(subject.app(), app); 
	});
	
	suite('LifeTime', () => 
	{
		test('Action is destroyed - Lifetime object is killed', () => 
		{
			var isKilled = false;
			var subject = new Action();
			
			subject.LT().bindToLife(() => {}, () => { isKilled = true; });
			
			
			subject.events().triggerDestroy();
			
			
			assert.isTrue(isKilled);
		});
		
		test('LifeTime object is extracted from Action', () => 
		{
			var action = new Action();
			
			assert.strictEqual(Action.lifeTimeBuilder(action), action.LT());
		});
		
		test('Non action passed to lifeTimeBuilder, return null', () => 
		{
			assert.isNull(Action.lifeTimeBuilder(123));
		});
	});
	
	suite('modules', () => 
	{
		test('Modules not set, return null', () =>
		{
			var subject = new Action();
			
			subject.setChainLink({ app: () => null });
			
			assert.isNull(subject.modules('a'));
		});
		
		test('Modules Manager set, return module by name', () =>
		{
			var subject = new Action();
			
			var passedName = null;
			var module = {};
			
			subject.setModuleManager({ get: (a) => { passedName = a; return module; } });
			
			assert.strictEqual(subject.modules('a'), module);
			assert.equal(passedName, 'a');
		});
		
		test('No name passed, return module manager', () =>
		{
			var subject = new Action();
			var moduleManager = { 'a': true };
			
			subject.setModuleManager(moduleManager);
			
			assert.strictEqual(subject.modules(), moduleManager);
		});
	});
	
	suite('setModuleManager', () => 
	{
		test('Module manager set', () =>
		{
			var subject = new Action();
			var moduleManager = { 'a': true };
			
			subject.setModuleManager(moduleManager);
			
			assert.strictEqual(subject.modules(), moduleManager);
		});
	});
});