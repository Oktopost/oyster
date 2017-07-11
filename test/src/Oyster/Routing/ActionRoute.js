const root = require('../../../index');
const assert = require('chai').assert;


const ActionRoute = root.Oyster.Routing.ActionRoute;


suite('ActionRoute', () => 
{
	test('route', () => 
	{
		var subject = new ActionRoute({});
		var obj = {};
		
		subject.setRoute(obj);
		
		assert.strictEqual(obj, subject.route());
	});
	
	test('actions', () => 
	{
		var subject = new ActionRoute({});
		var obj = ['a'];
		
		subject.setActions(obj, ['b']);
		
		assert.deepEqual(obj, subject.actions());
	});
	
	test('params', () => 
	{
		var subject = new ActionRoute({});
		var obj = ['a'];
		
		subject.setActions(['b'], obj);
		
		assert.deepEqual(obj, subject.params());
	});
	
	test('used by value', function () 
	{
		var subject = new ActionRoute({});
		var params = ['a'];
		var actions = ['b'];
		
		subject.setActions(actions, params);
		
		actions.push(2);
		params.push(3);
		
		assert.deepEqual(['a'], subject.params());
		assert.deepEqual(['b'], subject.actions());
		
		params = subject.params();
		actions = subject.actions();
		params.push(3);
		actions.push(2);
		
		assert.deepEqual(['a'], subject.params());
		assert.deepEqual(['b'], subject.actions());
	});
});