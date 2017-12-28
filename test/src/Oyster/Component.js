const root = require('../../index');
const assert = require('chai').assert;


const Component			= root.Oyster.Component;
const ModuleManager		= root.Oyster.ModuleManager;
const LifeBindFactory	= root.Duct.LT.LifeBindFactory;


suite('Component', () => 
{
	suite('_manager', () => 
	{
		test('No parameter passed, module manager returned', () => 
		{
			var manager = new ModuleManager();
			var component = new Component();
			
			component._setModuleManager(manager);
			
			assert.strictEqual(component._manager(), manager);
		});
		
		test('Module name passed, module requested from manager', () => 
		{
			var manager = new ModuleManager();
			var component = new Component();
			var actualName = null;
			
			component._setModuleManager(manager);
			manager.get = function (name) { actualName = name; return 'ok'; };
			
			assert.equal(component._manager('abc'), 'ok');
			assert.equal(actualName, 'abc');
		});
	});
	
	suite('_isAlive', () => 
	{
		test('Component alive, return true', () =>
		{
			var component = new Component();
			assert.isTrue(component._isAlive());
		});
		
		test('Component destroyed, return false', () =>
		{
			var component = new Component();
			component._destroy();
			
			assert.isFalse(component._isAlive());
		});
	});
	
	suite('_isDestroyed', () => 
	{
		test('Component alive, return false', () =>
		{
			var component = new Component();
			assert.isFalse(component._isDestroyed());
		});
		
		test('Component destroyed, return true', () =>
		{
			var component = new Component();
			component._destroy();
			
			assert.isTrue(component._isDestroyed());
		});
	});
	
	suite('Getters', () => 
	{
		test('LT', () =>
		{
			var component = new Component();
			assert.strictEqual(component.LT(), component._node.LT());
		});
		
		test('getLifeTimeNode', () => 
		{
			var component = new Component();
			assert.strictEqual(component.getLifeTimeNode(), component._node);
		});
	});
	
	
	suite('_component', () =>
	{
		test('Function passed, new component returned', () => 
		{
			var component = new Component(); 
			var res = component._component(Component);
			
			assert.instanceOf(res, Component);
		});
		
		test('Component passed, same component returned', () => 
		{
			var component = new Component(); 
			var target = new Component();
			
			var res = component._component(target);
			
			assert.strictEqual(res, target);
		});
		
		test('Module manager passed', () => 
		{
			var component = new Component(); 
			component._setModuleManager(new ModuleManager());
			
			var res = component._component(Component);
			
			assert.strictEqual(res._moduleManager, component._moduleManager);
		});
		
		test('Mount called', () => 
		{
			var component = new Component(); 
			var target = new Component();
			var isCalled = false;
			
			target.mount = function () 
			{
				isCalled = true;
			};
			
			component._component(target);
			
			assert.isTrue(isCalled);
		});
		
		test('Manager set before mount is called', () => 
		{
			var component = new Component(); 
			var target = new Component();
			var manager = null;
			
			component._setModuleManager(new ModuleManager());
			
			target.mount = function () 
			{
				manager = this._moduleManager;
			};
			
			component._component(target);
			
			assert.strictEqual(manager, component._moduleManager);
		});
		
		test('Manager passed to mount', () => 
		{
			var component = new Component(); 
			var target = new Component();
			var actual = null;
			
			component._setModuleManager(new ModuleManager());
			
			target.mount = function (manager) 
			{
				actual = manager;
			};
			
			component._component(target);
			
			assert.strictEqual(actual, component._moduleManager);
		});
	});
	
	
	suite('_destroy', () => 
	{
		test('unmount called', () => 
		{
			var component = new Component();
			var isCalled = false;
			
			component.unmount = function (manager) 
			{
				isCalled = true;
			};
			
			
			component._destroy();
			
			assert.isTrue(isCalled);
		});
		
		test('children destroyed', () => 
		{
			var component = new Component(); 
			var target = new Component();
			
			component._component(target);
			component._destroy();
			
			assert.isTrue(target._isDestroyed());
		});
		
		test('unmount called only once', () => 
		{
			var component = new Component();
			var calledCount = 0;
			
			component.unmount = function (manager) 
			{
				calledCount++;
			};
			
			
			component._destroy();
			component._destroy();
			component._destroy();
			
			assert.equal(calledCount, 1);
		});
	});
	
	
	suite('LifeBindFactory', () => 
	{
		test('Component type', () => 
		{
			var component = new Component();
			assert.strictEqual(LifeBindFactory.instance().get(component), component.LT());
		});
		
		test('Other type', () => 
		{
			var l = { LT: function () { return new LifeTime(); }};
			
			assert.throws(() => LifeBindFactory.instance().get(l));
		});
	});
});