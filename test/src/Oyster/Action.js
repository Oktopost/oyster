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
});