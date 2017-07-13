const root = require('../../index');
const assert = require('chai').assert;


const func		= root.Plankton.func;
const inherit	= root.Classy.inherit;

const Action			= root.Oyster.Action;
const Navigator			= root.Oyster.Routing.Navigator;
const ActionsManager	= root.Oyster.ActionsManager;


suite('ActionsManager', () => 
{
	test('Setup sanity', () => 
	{
		var subject = new ActionsManager(() => {}, () => {});
		
		subject.setupPredefinedParams({'test_id' : /abc/});
		var res = subject.setupRoutes({
			$: {
				path: '{id|[test_id]}',
				action: Action,
			}
		});
		
		
		assert.instanceOf(res, Object);
		assert.instanceOf(res['$'], Object);
	});
	
	test('Get setup object sanity', () => 
	{
		var subject = new ActionsManager(() => {}, () => {});
		
		var setup = subject.setup();
		
		setup.addPredefinedParams({'test_id' : /abc/});
		var res = setup.addRoutes({
			$: {
				path: '{id|[test_id]}',
				action: Action,
			}
		});
		
		
		assert.instanceOf(res, Object);
		assert.instanceOf(res['$'], Object);
	});
	
	test('handleURL - router invoked', () => 
	{
		var calledWith;
		var subject = new ActionsManager(() => {}, (a) => { calledWith = a; });
		
		subject.handleURL('/abc');
		
		return (func.postponed(() => { assert.equal(calledWith, '/abc'); }, 1))();
	});
	
	test('handle', () => 
	{
		var subject = new ActionsManager(() => {}, () => {});
		var isCalled = false;
		
		function MyAction() {}
		inherit(MyAction, Action);
		
		MyAction.prototype.initialize = function () { isCalled = true; };
		
		subject.setupRoutes({
			$: 
			{
				path: 'abc',
				action: MyAction
			}
		});
		
		subject.handleURL('abc');
		
		return (func.postponed(() => { assert.isTrue(isCalled); }, 1))();
	});
	
	test('navigator', () => 
	{
		assert.instanceOf((new ActionsManager(() => {}, () => {})).navigator(), Navigator);
	});
});