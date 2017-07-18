const root = require('../../../../index');
const assert = require('chai').assert;


const inherit = root.Classy.inherit;

const Module		= root.Oyster.Module;
const Application	= root.Oyster.Application;
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
			var app = new Application();
			var obj = new TestModuleA();
			var res = ModuleBuilder.get(app, 'abc', obj);
			
			assert.strictEqual(res, obj);
			assert.equal(obj.control().name(), 'abc');
			assert.equal(obj.control().app(), app);
		});
		
		test('Pass name, constructor', () => 
		{
			var app = new Application();
			var res = ModuleBuilder.get(app, 'abc', TestModuleA);
			
			assert.instanceOf(res, TestModuleA);
			assert.equal(res.control().name(), 'abc');
			assert.equal(res.control().app(), app);
		});
		
		test('Pass name, invalid - exception thrown', () => 
		{
			assert.throws(() => { ModuleBuilder.get(new Application(), 'abc'); });
			assert.throws(() => { ModuleBuilder.get(new Application(), 'abc', {}); });
			assert.throws(() => { ModuleBuilder.get(new Application(), 'abc', 123); });
		});
		
		
		test('Pass instace', () => 
		{
			var obj = new TestModuleA();
			obj.moduleName = () => 'abc';
			
			var app = new Application();
			var res = ModuleBuilder.get(app, obj);
			
			assert.strictEqual(res, obj);
			assert.equal(res.control().name(), 'abc');
			assert.equal(res.control().app(), app);
		});
		
		test('Pass instance without name - exception thrown', () => 
		{
			assert.throws(() => { ModuleBuilder.get(new Application(), new TestModuleA()); });
		});
		
		
		test('Pass constructor with static name', () => 
		{
			var app = new Application();
			var res = ModuleBuilder.get(app, TestModuleStaticWithName);
			
			assert.instanceOf(res, TestModuleStaticWithName);
			assert.equal(res.control().name(), 'abc');
			assert.equal(res.control().app(), app);
		});
		
		test('Pass constructor without name - exception thrown', () => 
		{
			assert.throws(() => { ModuleBuilder.get(new Application(), TestModuleA); });
		});
		
		test('Pass constructor with static name method', () => 
		{
			var app = new Application();
			var res = ModuleBuilder.get(app, TestModuleStaticWithNameMethod);
			
			assert.instanceOf(res, TestModuleStaticWithNameMethod);
			assert.equal(res.control().name(), 'abc');
			assert.equal(res.control().app(), app);
		});
		
		test('Pass constructor with name', () => 
		{
			var app = new Application();
			var res = ModuleBuilder.get(app, TestModuleWithName);
			
			assert.instanceOf(res, TestModuleWithName);
			assert.equal(res.control().name(), 'abc');
		});
		
		test('Pass constructor with name method', () => 
		{
			var app = new Application();
			var res = ModuleBuilder.get(app, TestModuleWithNameMethod);
			
			assert.instanceOf(res, TestModuleWithNameMethod);
			assert.equal(res.control().name(), 'abc');
			assert.equal(res.control().name(), 'abc');
		});
		
		
		test('Passed invalid name method', () => 
		{
			var obj = new TestModuleA();
			obj.moduleName = () => 123;
			assert.throws(() => { ModuleBuilder.get(new Application(), obj); });
			
			obj.moduleName = 123;
			assert.throws(() => { ModuleBuilder.get(new Application(), obj); });
			
			assert.throws(() => { ModuleBuilder.get(new Application(), TestModuleStaticWithNameInvalid); });
			assert.throws(() => { ModuleBuilder.get(new Application(), TestModuleStaticWithNameMethodInvalid); });
		});
		
		
		test('Pass object', () => 
		{
			var app = new Application();
			var obj = new TestModuleA();
			var res = ModuleBuilder.get(app, { 'abc': TestModuleA, 'abd': obj });
			
			assert.instanceOf(res[0], TestModuleA);
			assert.strictEqual(res[1], obj);
			
			assert.equal(res[0].control().name(), 'abc');
			assert.equal(res[1].control().name(), 'abd');
			assert.equal(res[0].control().app(), app);
			assert.equal(res[1].control().app(), app);
		});
		
		test('Pass array', () => 
		{
			var app = new Application();
			var obj = new TestModuleA();
			obj.moduleName = () => '123';
			
			var res = ModuleBuilder.get(app, [ TestModuleWithNameMethod, obj ]);
			
			assert.instanceOf(res[0], TestModuleWithNameMethod);
			assert.strictEqual(res[1], obj);
			
			assert.equal(res[0].control().name(), 'abc');
			assert.equal(res[1].control().name(), '123');
			assert.equal(res[0].control().app(), app);
			assert.equal(res[1].control().app(), app);
		});
		
		test('Pass complex structure', () => 
		{
			var app = new Application();
			var obj = new TestModuleA();
			obj.moduleName = () => '123';
			
			var res = ModuleBuilder.get(app, [ TestModuleWithNameMethod, { 'a': TestModuleA }, [ obj ] ]);
			
			assert.instanceOf(res[0], TestModuleWithNameMethod);
			assert.instanceOf(res[1], TestModuleA);
			assert.strictEqual(res[2], obj);
			
			assert.equal(res[0].control().name(), 'abc');
			assert.equal(res[1].control().name(), 'a');
			assert.equal(res[2].control().name(), '123');
			assert.equal(res[0].control().app(), app);
			assert.equal(res[1].control().app(), app);
			assert.equal(res[2].control().app(), app);
		});
		
		
		test('Pass invalid - exception thrown', () => 
		{
			assert.throws(() => { ModuleBuilder.get(new Application(), null); });
			assert.throws(() => { ModuleBuilder.get(new Application(), 123); });
		});
	});
	
	test('_extractName', () => 
	{
		assert.equal(ModuleBuilder._extractName('abc'), 'abc');
	});
});