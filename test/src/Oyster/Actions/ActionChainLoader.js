const root = require('../../../index');
const assert = require('chai').assert;


const Action			= root.Oyster.Action;
const ActionEvents		= root.Oyster.Modules.Routing.TreeActions.ActionEvents;
const ActionChainLoader	= root.Oyster.Actions.ActionChainLoader;


suite('ActionChainLoader', () => 
{
	function assertCalled(methods, toInvoke)
	{
		var prm1 = { a: 1 };
		var prm2 = { b: 1 };
		
		var invoked = [];
		var subject = [];
		var expected = [];
		var count = 2;
		
		for (var i = 1; i <= count; i++)
		{
			subject.push({
				action: ((i) => () => 
				{
					return {
						events:		() => new ActionEvents(),
						deactivate: (p1, p2) => invoked.push(['deactivate',		'a' + i, p1, p2]),
						initialize: (p1, p2) => invoked.push(['initialize',		'a' + i, p1, p2]),
						refresh:	(p1, p2) => invoked.push(['refresh',		'a' + i, p1, p2]),
						update:		(p1, p2) => invoked.push(['update',			'a' + i, p1, p2]),
						activate:	(p1, p2) => invoked.push(['activate',		'a' + i, p1, p2]),
						execute:	(p1, p2) => invoked.push(['execute',		'a' + i, p1, p2]),
						destroy:	(p1, p2) => invoked.push(['destroy',		'a' + i, p1, p2])
					};
				})(i)
			});
			
			for (var a = 0; a < methods.length; a++)
			{
				expected.push([methods[a], 'a' + i, prm1, prm2]);
			}
		}
		
		
		var p = (ActionChainLoader[toInvoke])(subject, prm1, prm2);
		
		if (p && p instanceof Promise)
		{
			return p.then(() => 
				{
					assert.deepEqual(
						invoked,
						expected
					);
				}
			);
		}
		else 
		{
			assert.deepEqual(
				invoked,
				expected
			);
		}
	}
	
	
	test('correct methods invoked', () => 
	{
		assertCalled(['deactivate'], 'invokeDeactivate');
		assertCalled(['refresh'], 'invokeRefresh');
		assertCalled(['initialize'], 'invokeInitialize');
		assertCalled(['activate', 'execute'], 'invokeActivate');
		assertCalled(['update', 'execute'], 'invokeUpdate');
		
		return assertCalled(['destroy'], 'invokeDestroy');
	});
	
	test('missing method will not be invoked', () => 
	{
		var _errorHandler = ActionChainLoader._errorHandler;
		
		try 
		{
			var isCalled = false;
			
			ActionChainLoader._errorHandler = function () { isCalled = true; };
			
			ActionChainLoader.invokeRefresh([{ action: () => { return {} } }], {}, {});
			
			assert.isFalse(isCalled);
		}
		finally 
		{
			ActionChainLoader._errorHandler = _errorHandler;
		}
	});
	
	test('exception handled', () => 
	{
		var _errorHandler = ActionChainLoader._errorHandler;
		
		try 
		{
			var isCalled = false;
			
			ActionChainLoader._errorHandler = function () { isCalled = true; };
			
			ActionChainLoader.invokeRefresh(
				[
					{ action: () => { return { 
						refresh: () => { throw 'FAILED'; }
					} } }
				],
				{}, {});
			
			assert.isTrue(isCalled);
		}
		finally 
		{
			ActionChainLoader._errorHandler = _errorHandler;
		}
	});
	
	test('object name extracted on failure', () => 
	{
		var _errorHandler = ActionChainLoader._errorHandler;
		
		try
		{
			var calledName = '';
			
			ActionChainLoader._errorHandler = function (a, b, name) { calledName = name; };
			
			ActionChainLoader.invokeRefresh(
				[
					{ action: () => { return { 
						refresh: () => { throw 'FAILED'; },
						constructor: { name: () => 'a' }
					} } }
				],
				{}, {});
			
			assert.equal(calledName, 'a');
			
			ActionChainLoader.invokeRefresh(
				[
					{ action: () => { return { 
						refresh: () => { throw 'FAILED'; },
						name: () => 'b'
					} } }
				],
				{}, {});
			
			assert.equal(calledName, 'b');
			
			ActionChainLoader.invokeRefresh(
				[
					{ action: () => { return { 
						refresh: () => { throw 'FAILED'; },
					} } }
				],
				{}, {});
			
			assert.equal(calledName, '[unknown]');
		}
		finally 
		{
			ActionChainLoader._errorHandler = _errorHandler;
		}
	});
	
	test('after exception invoke continues', () => 
	{
		var _errorHandler = ActionChainLoader._errorHandler;
		
		try 
		{
			var isCalled = false;
			
			ActionChainLoader._errorHandler = function () {};
			
			ActionChainLoader.invokeRefresh(
				[
					{ action: () => { return { 
						refresh: () => { throw 'FAILED'; }
					} } },
					{ action: () => { return { 
						refresh: () => { isCalled = true; } 
					} } }
				],
				{}, {});
			
			assert.isTrue(isCalled);
		}
		finally 
		{
			ActionChainLoader._errorHandler = _errorHandler;
		}
	});
	
	
	test('error handling sanity', () => 
	{
		var original = console.error;
		
		try
		{
			console.error = () => {};
			ActionChainLoader._errorHandler('a', 'b', 'c');
		}
		finally 
		{
			console.error = original;
		}
	});
	
	
	
	suite('invokeDeactivate', () => 
	{
		test('onDestroy event triggered on action', () => 
		{
			var isCalled = false;
			var action = new Action();
			
			action.events().onDestroy(() => { isCalled = true; });
			
			ActionChainLoader.invokeDeactivate(
				[
					{ action: () => action }
				],
				{}, {});
			
			assert.equal(isCalled, true);
		});
	});
});
