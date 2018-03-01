const root = require('../../index');
const assert = require('chai').assert;

const inherit			= root.Classy.inherit;
const Component			= root.Oyster.Component;
const ModuleManager		= root.Oyster.ModuleManager;

const Binder			= root.Duct.LT.Binder;
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
			
			assert.strictEqual(component.manager(), manager);
		});
		
		test('Manager not set, return null', () => 
		{
			var component = new Component();
			
			assert.isNull(component.manager());
		});
		
		
		test('Module name passed, module requested from manager', () => 
		{
			var manager = new ModuleManager();
			var component = new Component();
			var actualName = null;
			
			component._setModuleManager(manager);
			manager.get = function (name) { actualName = name; return 'ok'; };
			
			assert.equal(component.manager('abc'), 'ok');
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
			var res = component.component(Component);
			
			assert.instanceOf(res, Component);
		});
		
		test('Component passed, same component returned', () => 
		{
			var component = new Component(); 
			var target = new Component();
			
			var res = component.component(target);
			
			assert.strictEqual(res, target);
		});
		
		test('Module manager passed', () => 
		{
			var component = new Component(); 
			component._setModuleManager(new ModuleManager());
			
			var res = component.component(Component);
			
			assert.strictEqual(res._moduleManager, component._moduleManager);
		});
		
		test('Mount called', () => 
		{
			var component = new Component(); 
			var target = new Component();
			var isCalled = false;
			
			target._mount = function () 
			{
				isCalled = true;
			};
			
			component.component(target);
			
			assert.isTrue(isCalled);
		});
		
		test('Manager set before mount is called', () => 
		{
			var component = new Component(); 
			var target = new Component();
			var manager = null;
			
			component._setModuleManager(new ModuleManager());
			
			target._mount = function () 
			{
				manager = this._moduleManager;
			};
			
			component.component(target);
			
			assert.strictEqual(manager, component._moduleManager);
		});
		
		test('Manager passed to mount', () => 
		{
			var component = new Component(); 
			var target = new Component();
			var actual = null;
			
			component._setModuleManager(new ModuleManager());
			
			target._mount = function (manager) 
			{
				actual = manager;
			};
			
			component.component(target);
			
			assert.strictEqual(actual, component._moduleManager);
		});
	});
	
	
	suite('_destroy', () => 
	{
		test('unmount called', () => 
		{
			var component = new Component();
			var isCalled = false;
			
			component._unmount = function (manager) 
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
			
			component.component(target);
			component._destroy();
			
			assert.isTrue(target._isDestroyed());
		});
		
		test('unmount called only once', () => 
		{
			var component = new Component();
			var calledCount = 0;
			
			component._unmount = function (manager) 
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
	
	
	suite('constructor', () => 
	{
		test('Binder called on appropriate functions', () => 
		{
			function Com() { Component.call(this); }
			inherit(Com, Component);
			
			Com.prototype._handleA = function() {};
			Com.prototype._aHandler = function() {};
			
			var c = new Com();
			
			assert.equal(c._handleA[Binder.ATTACHMENT_KEY], c.LT());
			assert.equal(c._aHandler[Binder.ATTACHMENT_KEY], c.LT());
		});
		
		test('Binder will not attach LT to functions not matching handler pattern', () => 
		{
			function Com() { Component.call(this); }
			inherit(Com, Component);
			
			Com.prototype.handleA = function() {};
			Com.prototype.aHandler = function() {};
			Com.prototype.aHandle = function() {};
			Com.prototype.handlerA = function() {};
			
			var c = new Com();
			
			assert.isUndefined(c.handleA[Binder.ATTACHMENT_KEY], c.LT());
			assert.isUndefined(c.aHandler[Binder.ATTACHMENT_KEY], c.LT());
			assert.isUndefined(c.aHandle[Binder.ATTACHMENT_KEY], c.LT());
			assert.isUndefined(c.handlerA[Binder.ATTACHMENT_KEY], c.LT());
		});
	});
});