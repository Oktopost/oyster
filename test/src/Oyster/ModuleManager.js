const root = require('../../index');
const assert = require('chai').assert;


const func		= root.Plankton.func;

const Module		= root.Oyster.Module;
const ModuleManager	= root.Oyster.ModuleManager;


suite('ModuleManager', () => 
{
	suite('onLoad', () => 
	{
		test('Not in loading state', () => 
		{
			var isCalled = false;
			var subject = new ModuleManager();
			
			subject.onLoaded(() => { isCalled = true; });
			
			
			return (func.postponed(() => { assert.isTrue(isCalled); }, 0))();
		});
		
		
		test('In loading state, called after load is invoked', () => 
		{
			var calledSeq = [];
			var subject = new ModuleManager();
			
			var module = new Module();
			module.moduleName = 'mod';
			module.initialize = () => { calledSeq.push('a'); };
			
			subject.add(module);
			subject.onLoaded(() => { calledSeq.push('b'); });
			
			return (func.postponed(() => { assert.deepEqual(calledSeq, ['a', 'b']); }, 1))();
		});
		
		test('onLoad invoked only once', () => 
		{
			var calledSeq = [];
			var subject = new ModuleManager();
			
			var module = new Module();
			module.moduleName = 'mod';
			module.initialize = () => { calledSeq.push('a'); };
			
			subject.add(module);
			subject.onLoaded(() => 
			{
				calledSeq.push('b'); 
				module.moduleName = 'mod2';
				subject.add(module);
			});
			
			return (func.postponed(() => 
				{ 
					assert.deepEqual(calledSeq, ['a', 'b', 'a']); 
				}, 
				2))();
		});
	});
	
	
	suite('has', () => 
	{
		test('Module not found', () => 
		{
			var subject = new ModuleManager();
			
			assert.isFalse(subject.has('abc'));
		});
		
		test('Module found', () => 
		{
			var subject = new ModuleManager();
			
			var module = new Module();
			module.moduleName = 'abc';
			subject.add(module);
			
			return (func.postponed(() => 
				{ 
					assert.isTrue(subject.has('abc')); 
				}, 
				1))();
		});
	});
	
	
	suite('get', () => 
	{
		test('Module not found', () => 
		{
			var subject = new ModuleManager();
			
			assert.isNull(subject.get('abc'));
		});
		
		test('Module found', () => 
		{
			var subject = new ModuleManager();
			
			var module = new Module();
			module.moduleName = 'abc';
			subject.add(module);
			
			return (func.postponed(() => 
				{ 
					assert.strictEqual(subject.get('abc'), module); 
				}, 
				1))();
		});
	});
	
	
	suite('add', () => 
	{
		test('Module added', () => 
		{
			var subject = new ModuleManager();
			
			var module = new Module();
			module.moduleName = 'abc';
			subject.add(module);
			
			return (func.postponed(() => 
				{ 
					assert.strictEqual(subject.get('abc'), module); 
				}, 
				1))();
		});
		
		
		test('Module already existed, exception thrown', () => 
		{
			var subject = new ModuleManager();
			
			var module = new Module();
			module.moduleName = 'abc';
			subject.add(module);
			
			return (func.postponed(() => 
				{ 
					assert.throws(() => { subject._register(module) }); 
				}, 
				1))();
		});
	});
	
	
	suite('remove', () => 
	{
		test('Module does not exist, exception thrown', () => 
		{
			var subject = new ModuleManager();
			
			var module = new Module();
			module.control = () => { return { name: () => 'abc' }};
			
			assert.throws(() => { subject._deRegister(module) }); 
		});
		
		test('Module removed', () => 
		{
			var subject = new ModuleManager();
			
			var module = new Module();
			module.moduleName = 'abc';
			subject.add(module);
			
			return (func.postponed(() => 
				{ 
					subject.remove(module);
					
					return (func.postponed(() => 
						{ 
							assert.isFalse(subject.has('abc'));
						}, 
						1))();
				}, 
				1))();
		});
	});
	
	
	suite('alterations of names', () => 
	{
		test('As string', () => 
		{
			var subject = new ModuleManager();
			
			var module = new Module();
			module.moduleName = 'abc';
			subject.add(module);
			
			return (func.postponed(() => 
				{ 
					assert.strictEqual(subject.get('abc'), module); 
				}, 
				1))();
		});
		
		test('Object with moduleName string', () => 
		{
			var subject = new ModuleManager();
			
			var module = new Module();
			module.moduleName = 'abc';
			subject.add(module);
			
			return (func.postponed(() => 
				{ 
					assert.strictEqual(subject.get({moduleName: 'abc'}), module); 
				}, 
				1))();
		});
		
		test('Object with moduleName function', () => 
		{
			var subject = new ModuleManager();
			
			var module = new Module();
			module.moduleName = 'abc';
			subject.add(module);
			
			return (func.postponed(() => 
				{ 
					assert.strictEqual(subject.get({moduleName: () => 'abc'}), module); 
				}, 
				1))();
		});
		
		test('Other non string value ocnverted to string', () => 
		{
			var subject = new ModuleManager();
			
			var module = new Module();
			module.moduleName = '123';
			subject.add(module);
			
			return (func.postponed(() => 
				{ 
					assert.strictEqual(subject.get(123), module); 
				}, 
				1))();
		});
	});
});