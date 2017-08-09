const root = require('../../../../../index');
const assert = require('chai').assert;


const Listener		= root.Duct.Listener;
const LifeBind		= root.Duct.LT.LifeBind;
const ActionEvents	= root.Oyster.Modules.Routing.TreeActions.ActionEvents;


suite('ActionEvents', () => 
{
	suite('destroy', () => 
	{
		test('onDestroy - listener returned', () => 
		{
			var events = new ActionEvents();
			assert.instanceOf(events.onDestroy(), Listener);
		});
		
		test('onDestroy - listener is valid', () => 
		{
			var called = false;
			var events = new ActionEvents();
			
			events.onDestroy().add(() => { called = true; });
			events.triggerDestroy();
			
			assert.equal(called, true);
		});
		
		test('onDestroy - passed callback registered', () => 
		{
			var called = false;
			var events = new ActionEvents();
			
			events.onDestroy(() => { called = true; });
			events.triggerDestroy();
			
			assert.equal(called, true);
		});
		
		test('onDestroy - passed callback with lifetime object registered', () => 
		{
			var called = false;
			var events = new ActionEvents();
			
			events.onDestroy(new LifeBind(), () => { called = true; });
			events.triggerDestroy();
			
			assert.equal(called, true);
		});
		
		test('triggerDestroy - all events are cleared', () => 
		{
			var called = false;
			var events = new ActionEvents();
			
			events.onDestroy(new LifeBind(), () => { called = true; });
			events.triggerDestroy();
			
			// Reset after the first call
			called = false;
			
			events.triggerDestroy();
			assert.equal(called, false);
		});
	});
});