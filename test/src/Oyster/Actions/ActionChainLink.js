const root = require('../../../index');
const assert = require('chai').assert;


const Action			= root.Oyster.Action;
const ActionChainLink	= root.Oyster.Actions.ActionChainLink;


suite('ActionChainLink', () => 
{
	test('Consturctor', () =>
	{
		var action = new Action();
		var subject = new ActionChainLink(action);
		
		assert.isNull(subject.child());
		assert.isNull(subject.parent());
		assert.isFalse(subject.isMounted());
		assert.strictEqual(subject.action(), action);
	});
	
	
	test('updateRelations', () => 
	{
		var subject = new ActionChainLink(new Action());
		var a = new ActionChainLink(new Action());
		var b = new ActionChainLink(new Action());
		
		ActionChainLink.updateRelations(subject, a, b);
		
		assert.equal(subject.child(), a);
		assert.equal(subject.parent(), b);
		
		ActionChainLink.updateRelations(subject, null, null);
		
		assert.isNull(subject.child());
		assert.isNull(subject.parent());
	});
	
	test('unmount', () => 
	{
		var subject = new ActionChainLink(new Action());
		
		ActionChainLink.updateRelations(subject, new ActionChainLink(new Action()), new ActionChainLink(new Action()));
		ActionChainLink.unmount(subject);
		
		assert.isNull(subject.child());
		assert.isNull(subject.parent());
		assert.isFalse(subject.isMounted());
	});
	
	
	test('hasChild', () => 
	{
		var subject = new ActionChainLink(new Action());
		
		assert.isFalse(subject.hasChild());
		
		ActionChainLink.updateRelations(subject, 'a', 'b');
		
		assert.isTrue(subject.hasChild());
	});
	
	
	test('hasParent', () => 
	{
		var subject = new ActionChainLink(new Action());
		
		assert.isFalse(subject.hasParent());
		
		ActionChainLink.updateRelations(subject, 'a', 'b');
		
		assert.isTrue(subject.hasParent());
	});
	
	
	suite('childAction', () => 
	{
		test('Has Child Link', () => {
			var action = new Action();
			var subject = new ActionChainLink(new Action());
			
			ActionChainLink.updateRelations(subject, new ActionChainLink(action), null);
		
			assert.strictEqual(subject.childAction(), action);
		});
		
		test('No child link, return null', () => {
			var action = new Action();
			var subject = new ActionChainLink(new Action());
			
			ActionChainLink.updateRelations(subject, null, null);
		
			assert.isNull(subject.childAction());
		});
	});
	
	
	suite('parentAction', () => 
	{
		test('Has Parent Link', () => {
			var action = new Action();
			var subject = new ActionChainLink(new Action());
			
			ActionChainLink.updateRelations(subject, null, new ActionChainLink(action));
		
			assert.strictEqual(subject.parentAction(), action);
		});
		
		test('No child link, return null', () => {
			var action = new Action();
			var subject = new ActionChainLink(new Action());
			
			ActionChainLink.updateRelations(subject, null, null);
		
			assert.isNull(subject.parentAction());
		});
	});
});