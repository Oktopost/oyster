const root = require('../../index');
const assert = require('chai').assert;


const Action = root.Oyster.Action;


suite('Action', () => 
{
	test('sanity', () => 
	{
		var subject = new Action();
		
		var chainLink = {a: 1};
		var params = { b: 2 };
		
		subject.setChainLink(chainLink);
		subject.setParams(params);
		
		assert.strictEqual(subject.params(), params);
		assert.strictEqual(subject.chain(), chainLink);
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
});