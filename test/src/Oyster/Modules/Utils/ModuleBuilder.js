const root = require('../../../../index');
const assert = require('chai').assert;


const inherit = root.Classy.inherit;

const Module		= root.Oyster.Module;
const ModuleBuilder	= root.Oyster.Modules.Utils.ModuleBuilder;


function TestModuleA() {}
inherit(TestModuleA, Module);


function TestModuleStaticWithName() {}
TestModuleStaticWithName.moduleName = 'abc';
inherit(TestModuleStaticWithName, Module);

function TestModuleStaticWithNameInvalid() {}
TestModuleStaticWithNameInvalid.moduleName = 123;
inherit(TestModuleStaticWithNameInvalid, Module);


function TestModuleStaticWithNameMethod() {}
TestModuleStaticWithNameMethod.moduleName = () => 'abc';
inherit(TestModuleStaticWithNameMethod, Module);


function TestModuleStaticWithNameMethodInvalid() {}
TestModuleStaticWithNameMethodInvalid.moduleName = () => 123;
inherit(TestModuleStaticWithNameMethodInvalid, Module);


function TestModuleWithName()
{
	this.moduleName = 'abc';
}
inherit(TestModuleWithName, Module);


function TestModuleWithNameMethod()
{
	this.moduleName = () => 'abc';
}
inherit(TestModuleWithNameMethod, Module);


suite('ModuleBuilder', () => 
{
	suite('get', () => 
	{
		test('Pass name, module', () => 
		{
			var obj = new TestModuleA();
			var res = ModuleBuilder.get({}, 'abc', obj);
			
			assert.strictEqual(res, obj);
			assert.equal(obj.control().name(), 'abc');
		});
		
		test('Pass name, constructor', () => 
		{
			var res = ModuleBuilder.get({}, 'abc', TestModuleA);
			
			assert.instanceOf(res, TestModuleA);
			assert.equal(res.control().name(), 'abc');
		});
		
		test('Pass name, invalid - exception thrown', () => 
		{
			assert.throws(() => { ModuleBuilder.get({}, 'abc'); });
			assert.throws(() => { ModuleBuilder.get({}, 'abc', {}); });
			assert.throws(() => { ModuleBuilder.get({}, 'abc', 123); });
		});
		
		
		test('Pass instace', () => 
		{
			var obj = new TestModuleA();
			obj.moduleName = () => 'abc';
			
			var res = ModuleBuilder.get({}, obj);
			
			assert.strictEqual(res, obj);
			assert.equal(res.control().name(), 'abc');
		});
		
		test('Pass instance without name - exception thrown', () => 
		{
			assert.throws(() => { ModuleBuilder.get({}, new TestModuleA()); });
		});
		
		
		test('Pass constructor with static name', () => 
		{
			var res = ModuleBuilder.get({}, TestModuleStaticWithName);
			
			assert.instanceOf(res, TestModuleStaticWithName);
			assert.equal(res.control().name(), 'abc');
		});
		
		test('Pass constructor without name - exception thrown', () => 
		{
			assert.throws(() => { ModuleBuilder.get({}, TestModuleA); });
		});
		
		test('Pass constructor with static name method', () => 
		{
			var res = ModuleBuilder.get({}, TestModuleStaticWithNameMethod);
			
			assert.instanceOf(res, TestModuleStaticWithNameMethod);
			assert.equal(res.control().name(), 'abc');
		});
		
		test('Pass constructor with name', () => 
		{
			var res = ModuleBuilder.get({}, TestModuleWithName);
			
			assert.instanceOf(res, TestModuleWithName);
			assert.equal(res.control().name(), 'abc');
		});
		
		test('Pass constructor with name method', () => 
		{
			var res = ModuleBuilder.get({}, TestModuleWithNameMethod);
			
			assert.instanceOf(res, TestModuleWithNameMethod);
			assert.equal(res.control().name(), 'abc');
		});
		
		
		test('Passed invalid name method', () => 
		{
			var obj = new TestModuleA();
			obj.moduleName = () => 123;
			assert.throws(() => { ModuleBuilder.get({}, obj); });
			
			obj.moduleName = 123;
			assert.throws(() => { ModuleBuilder.get({}, obj); });
			
			assert.throws(() => { ModuleBuilder.get({}, TestModuleStaticWithNameInvalid); });
			assert.throws(() => { ModuleBuilder.get({}, TestModuleStaticWithNameMethodInvalid); });
		});
		
		
		test('Pass object', () => 
		{
			var obj = new TestModuleA();
			var res = ModuleBuilder.get({}, { 'abc': TestModuleA, 'abd': obj });
			
			assert.instanceOf(res[0], TestModuleA);
			assert.strictEqual(res[1], obj);
			
			assert.equal(res[0].control().name(), 'abc');
			assert.equal(res[1].control().name(), 'abd');
		});
		
		test('Pass array', () => 
		{
			var obj = new TestModuleA();
			obj.moduleName = () => '123';
			
			var res = ModuleBuilder.get({}, [ TestModuleWithNameMethod, obj ]);
			
			assert.instanceOf(res[0], TestModuleWithNameMethod);
			assert.strictEqual(res[1], obj);
			
			assert.equal(res[0].control().name(), 'abc');
			assert.equal(res[1].control().name(), '123');
		});
		
		test('Pass complex structure', () => 
		{
			var obj = new TestModuleA();
			obj.moduleName = () => '123';
			
			var res = ModuleBuilder.get({}, [ TestModuleWithNameMethod, { 'a': TestModuleA }, [ obj ] ]);
			
			assert.instanceOf(res[0], TestModuleWithNameMethod);
			assert.instanceOf(res[1], TestModuleA);
			assert.strictEqual(res[2], obj);
			
			assert.equal(res[0].control().name(), 'abc');
			assert.equal(res[1].control().name(), 'a');
			assert.equal(res[2].control().name(), '123');
		});
		
		
		test('Pass invalid - exception thrown', () => 
		{
			assert.throws(() => { ModuleBuilder.get({}, null); });
			assert.throws(() => { ModuleBuilder.get({}, 123); });
		});
	});
	
	test('_extractName', () => 
	{
		assert.equal(ModuleBuilder._extractName('abc'), 'abc');
	});
});