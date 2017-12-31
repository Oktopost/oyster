const root = require('../../../../index');
const assert = require('chai').assert;


const func		= root.Plankton.func;
const inherit	= root.Classy.inherit;

const Action			= root.Oyster.Action;
const Navigator			= root.Oyster.Routing.Navigator;
const TreeActionsModule	= root.Oyster.Modules.Routing.TreeActionsModule;

const OysterModules			= root.Oyster.Modules.OysterModules;
const BaseNavigationModule	= root.Oyster.Modules.BaseNavigationModule;


suite('TreeActionsModule', () => 
{
	function createSubject(baseNav)
	{
		var subject = new TreeActionsModule();
		
		subject.manager = () => { return { get: (a) => 
		{
			if (a === OysterModules.NavigationModule)
			{
				return (baseNav || new BaseNavigationModule());
			}
		} } };
		
		subject.preLoad();
		subject.app = () => { return {}; };
		
		return subject;
	}
	
	
	test('Setup sanity', () => 
	{
		var subject = createSubject();
		
		subject.setupPredefinedParams({'test_id' : /abc/});
		var res = subject.setupRoutes({
			$: {
				path: '{id|[test_id]}',
				action: Action,
			}
		});
		
		
		assert.strictEqual(subject._chain._module, subject);
		assert.instanceOf(res, Object);
		assert.instanceOf(res['$'], Object);
	});
	
	test('handleURL - router invoked', () => 
	{
		var calledWith;
		var subject = createSubject({ navigate: () => {}, handleMiss: (a) => { calledWith = a; } });
		
		subject.handleURL('/abc');
		
		return (func.postponed(() => { assert.equal(calledWith, '/abc'); }, 1))();
	});
	
	test('handle', () => 
	{
		var subject = createSubject();
		var isCalled = false;
		
		function MyAction() { Action.call(this); }
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
		assert.instanceOf(createSubject().navigator(), Navigator);
	});
});