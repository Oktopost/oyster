const root = require('../../../index');
const assert = require('chai').assert;


const ActionChainLink	= root.Oyster.Actions.ActionChainLink;


suite('ActionChainLink', () => 
{
	test('Consturctor', () =>
	{
		var subject = new ActionChainLink();
		
		assert.isNull(subject.child());
		assert.isNull(subject.parent());
		assert.isTrue(subject.isMounted());
	});
	
	
	test('updateRelations', () => 
	{
		var subject = new ActionChainLink();
		
		ActionChainLink.updateRelations(subject, 'a', 'b');
		
		assert.equal('a', subject.child());
		assert.equal('b', subject.parent());
	});
	
	test('unmount', () => 
	{
		var subject = new ActionChainLink();
		
		ActionChainLink.updateRelations(subject, 'a', 'b');
		ActionChainLink.unmount(subject);
		
		assert.isNull(subject.child());
		assert.isNull(subject.parent());
		assert.isFalse(subject.isMounted());
	});
	
	
	test('hasChild', () => 
	{
		var subject = new ActionChainLink();
		
		assert.isFalse(subject.hasChild());
		
		ActionChainLink.updateRelations(subject, 'a', 'b');
		
		assert.isTrue(subject.hasChild());
	});
	
	
	test('hasParent', () => 
	{
		var subject = new ActionChainLink();
		
		assert.isFalse(subject.hasParent());
		
		ActionChainLink.updateRelations(subject, 'a', 'b');
		
		assert.isTrue(subject.hasParent());
	});
});