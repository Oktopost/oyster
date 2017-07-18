const root = require('../../../../index');
const assert = require('chai').assert;


const func		= root.Plankton.func;

const Module			= root.Oyster.Module;
const Application		= root.Oyster.Application;
const Loader			= root.Oyster.Modules.Utils.Loader;
const ModuleController	= root.Oyster.Modules.Utils.ModuleController;


suite('Loader', () => 
{
	/**
	 * @param {string} name
	 * @return {Module}
	 */
	function create(name)
	{
		var m = new Module;
		var controller = new ModuleController(new Application(), name);
		
		m.setController(controller);
		
		return m;
	}
	
	
	suite('isLoading', () => 
	{
		test('New object, return false', () => 
		{
			assert.isFalse((new Loader(() => {}, () => {})).isLoading());
		});
		
		test('Loading, return true', () => 
		{
			var subject = new Loader(() => {}, () => {});
			subject.load([]);
			assert.isTrue(subject.isLoading());
		});
		
		test('After loading, return false', () => 
		{
			var subject = new Loader(() => {}, () => {});
			subject.load([]);
			
			return (func.postponed(() => 
			{
				assert.isFalse(subject.isLoading());
			}, 1))();
		});
	});
	
	
	suite('Loading process', () => 
	{
		test('Single module loaded', () => 
		{
			var m = create('a');
			var calledWith; 
			var subject = new Loader((mod) => { calledWith = mod; }, () => {});
			
			subject.load(m);
			
			return (func.postponed(() => 
			{
				assert.strictEqual(calledWith, m);
			}, 1))();
		});
		
		test('Array of modules, modules loaded', () => 
		{
			var m1 = create('a');
			var m2 = create('b');
			
			var calledWith = []; 
			var subject = new Loader((mod) => { calledWith.push(mod); }, () => {});
			
			subject.load([m1, m2]);
			
			return (func.postponed(() => 
			{
				assert.deepEqual(calledWith, [m1, m2]);
			}, 1))();
		});
		
		test('Number of arrays passed for load', () => 
		{
			var m1 = create('a');
			var m2 = create('b');
			var m3 = create('c');
			var m4 = create('d');
			
			var calledWith = []; 
			var subject = new Loader((mod) => { calledWith.push(mod); }, () => {});
			
			subject.load([[m1, m2], [m3, m4]]);
			
			return (func.postponed(() => 
			{
				assert.deepEqual(calledWith, [m1, m2, m3, m4]);
			}, 1))();
		});
		
		
		test('Single module unloaded', () => 
		{
			var m = create('a');
			var calledWith; 
			var subject = new Loader(() => {}, (mod) => { calledWith = mod; });
			
			subject.unload(m);
			
			return (func.postponed(() => 
			{
				assert.strictEqual(calledWith, m);
			}, 1))();
		});
		
		test('Array of modules, modules unloaded', () => 
		{
			var m1 = create('a');
			var m2 = create('b');
			
			var calledWith = []; 
			var subject = new Loader(() => {}, (mod) => { calledWith.push(mod); });
			
			subject.unload([m1, m2]);
			
			return (func.postponed(() => 
			{
				assert.deepEqual(calledWith, [m1, m2]);
			}, 1))();
		});
		
		test('Number of arrays passed for unload', () => 
		{
			var m1 = create('a');
			var m2 = create('b');
			var m3 = create('c');
			var m4 = create('d');
			
			var calledWith = []; 
			var subject = new Loader(() => {}, (mod) => { calledWith.push(mod); });
			
			subject.unload([[m1, m2], [m3, m4]]);
			
			return (func.postponed(() => 
			{
				assert.deepEqual(calledWith, [m1, m2, m3, m4]);
			}, 1))();
		});
		
		
		test('Same module passed, error thrown', () => 
		{
			var m1 = create('a');
			
			var subject = new Loader(() => {}, () => {});
			
			assert.throws(() => 
			{
				subject.load([m1, m1]);
			});
		});
		
		
		test('Modules loaded and unloaded in the requested order', () => 
		{
			var m1 = create('a');
			var m2 = create('b');
			var m3 = create('c');
			var m4 = create('d');
			var m5 = create('e');
			var m6 = create('f');
			
			var stack = [];
			
			m1.initialize = function() { stack.push(['initialize', m1]); };
			m2.initialize = function() { stack.push(['initialize', m2]); };
			m3.initialize = function() { stack.push(['initialize', m3]); };
			m4.initialize = function() { stack.push(['initialize', m4]); };
			m5.initialize = function() { stack.push(['initialize', m5]); };
			m6.initialize = function() { stack.push(['initialize', m6]); };
			
			m1.preLoad = function() { stack.push(['preLoad', m1]); };
			m2.preLoad = function() { stack.push(['preLoad', m2]); };
			m3.preLoad = function() { stack.push(['preLoad', m3]); };
			m4.preLoad = function() { stack.push(['preLoad', m4]); };
			m5.preLoad = function() { stack.push(['preLoad', m5]); };
			m6.preLoad = function() { stack.push(['preLoad', m6]); };
			
			m1.preUnload = function() { stack.push(['preUnload', m1]); };
			m2.preUnload = function() { stack.push(['preUnload', m2]); };
			m3.preUnload = function() { stack.push(['preUnload', m3]); };
			m4.preUnload = function() { stack.push(['preUnload', m4]); };
			m5.preUnload = function() { stack.push(['preUnload', m5]); };
			m6.preUnload = function() { stack.push(['preUnload', m6]); };
			
			var subject = new Loader(() => {}, () => {});
			
			subject.load([[m1, m2]]);
			subject.unload(m3);
			subject.load([[m4], [m5]]);
			subject.unload(m6);
			
			return (func.postponed(() => 
			{
				assert.deepEqual(stack, 
					[
						[ 'initialize', m1 ],
						[ 'initialize', m2 ],
						[ 'preLoad', m1 ],
						[ 'preLoad', m2 ],
						
						[ 'preUnload', m3 ],
						
						[ 'initialize', m4 ],
						[ 'preLoad', m4 ],
						
						[ 'initialize', m5 ],
						[ 'preLoad', m5 ],
						
						[ 'preUnload', m6 ],
					]);
			}, 2))();
		});
	});
	
	
	suite('Error Handling', () => 
	{
		test('Error in _loop handled', () => 
		{
			var err = console.error;
			var isCalled = false;
			var subject = new Loader(() => {}, () => {});
			
			console.error = (...args) => { args[0] === 'Error in load loop' ? isCalled = true : err.call(console, ...args); };
			subject._loop = function () { throw 'Error!'; };
			subject.load([]);
			
			return (func.postponed(() => 
			{
				assert.isTrue(isCalled);
			}, 1))();
		});
	});
});