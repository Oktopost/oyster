const root = require('../../index');
const assert = require('chai').assert;


const Action		= root.Oyster.Action;
const Application	= root.Oyster.Application;


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
	
	suite('modules', () => 
	{
		test('app not set, return null', () =>
		{
			var subject = new Action();
			var app = new Application();
			
			subject.setChainLink({ app: () => null });
			
			assert.isNull(subject.modules('a'));
		});
		
		test('app set, return module by name', () =>
		{
			var subject = new Action();
			var app = new Application();
			
			var module = {};
			
			app._modules._modules['a'] = module;
			subject.setChainLink({ app: () => app });
			
			assert.strictEqual(subject.modules('a'), module);
		});
	});
});