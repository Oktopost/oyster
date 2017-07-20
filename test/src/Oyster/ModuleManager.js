const root = require('../../index');
const assert = require('chai').assert;


const func		= root.Plankton.func;

const Module		= root.Oyster.Module;
const Application	= root.Oyster.Application;
const ModuleManager	= root.Oyster.ModuleManager;


function createSubject()
{
	return new ModuleManager(new Application());
}


suite('ModuleManager', () => 
{
	suite('onLoad', () => 
	{
		test('Not in loading state', () => 
		{
			var isCalled = false;
			var subject = createSubject();
			
			subject.onLoaded(() => { isCalled = true; });
			
			
			return (func.postponed(() => { assert.isTrue(isCalled); }, 0))();
		});
		
		
		test('In loading state, called after load is invoked', () => 
		{
			var calledSeq = [];
			var subject = createSubject();
			
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
			var subject = createSubject();
			
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
			var subject = createSubject();
			
			assert.isFalse(subject.has('abc'));
		});
		
		test('Module found', () => 
		{
			var subject = createSubject();
			
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
			var subject = createSubject();
			
			assert.isNull(subject.get('abc'));
		});
		
		test('Module found', () => 
		{
			var subject = createSubject();
			
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
			var subject = createSubject();
			
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
			var subject = createSubject();
			
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
		test('Remove by name', () => 
		{
			var calledWith;
			var module = { a: 1 };
			var subject = createSubject();
			
			subject._modules['a'] = module;
			subject._loader = { unload: (a) => { calledWith = a; } };
			
			subject.remove('a');
			
			assert.strictEqual(calledWith, module); 
		});
		
		test('Remove by name, when module with given name not registered, exception thrown', () => 
		{
			var subject = createSubject();
			
			assert.throws(() => { subject.remove('abc'); }); 
		});
		
		test('Module does not exist, exception thrown', () => 
		{
			var subject = createSubject();
			
			var module = new Module();
			module.control = () => { return { name: () => 'abc' }};
			
			assert.throws(() => { subject._deRegister(module) }); 
		});
		
		test('Module removed', () => 
		{
			var subject = createSubject();
			
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
			var subject = createSubject();
			
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
			var subject = createSubject();
			
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
			var subject = createSubject();
			
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
			var subject = createSubject();
			
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