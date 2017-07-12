const root = require('../../../../index');
const assert = require('chai').assert;


const inherit		= root.Classy.inherit;

const Module		= root.Oyster.Module;
const LoadSequence	= root.Oyster.Modules.Utils.LoadSequence;


function TestModule() 
{
	var self = this;
	
	
	self.add = function() {};
	
	
	this.module = function ()
	{
		return {
			setIsLoaded: function (val) { self.add([self, 'setIsLoaded', val]); }
		};
	};
	
	this.initialize	= function () { self.add([self, 'initialize']); };
	this.preLoad	= function () { self.add([self, 'preLoad']); };
	this.onLoad		= function () { self.add([self, 'onLoad']); };
	this.postLoad	= function () { self.add([self, 'postLoad']); };
	this.preUnload	= function () { self.add([self, 'preUnload']); };
	this.onUnload	= function () { self.add([self, 'onUnload']); };
	this.postUnload	= function () { self.add([self, 'postUnload']); };
	this.destroy	= function () { self.add([self, 'destroy']); };
}

inherit(TestModule, Module);


suite('LoadSequence', () => 
{
	test('sanity', () => 
	{
		var order = [];
		var subject = new LoadSequence((o) => order.push(['load', o]), (o) => order.push(['unload', o]));
		
		var objLoad1	= new TestModule();
		var objLoad2	= new TestModule();
		var objUnload	= new TestModule();
		
		objLoad1.add = (data) => order.push(data);
		objLoad2.add = (data) => order.push(data);
		objUnload.add = (data) => order.push(data);
		
		subject.execute([objLoad1, objLoad2], [objUnload]);
		
		assert.deepEqual(
			[
				[ objLoad1, 'initialize' ],
				[ objLoad2, 'initialize' ],
				
				[ objUnload, 'preUnload' ],
				[ objUnload, 'setIsLoaded', false ],
				[ objUnload, 'onUnload' ],
				
				[ 'unload', objUnload ],
				[ objUnload, 'postUnload' ],
				[ 'load', objLoad1 ],
				[ 'load', objLoad2 ],
				
				
				[ objLoad1, 'preLoad' ],
				[ objLoad2, 'preLoad' ],
				[ objLoad1, 'setIsLoaded', true ],
				[ objLoad2, 'setIsLoaded', true ],
				[ objLoad1, 'onLoad' ],
				[ objLoad2, 'onLoad' ],
				
				[ objLoad1, 'postLoad' ],
				[ objLoad2, 'postLoad' ],
				
				[ objUnload, 'destroy' ]
			],
			order
		);
	});
	
	test('error handled', () => 
	{
		var sameMethodCalled = false;
		var diffMethodCalled = false;
		var isHandlerInvoked = false;
		
		var subject = new LoadSequence((o) => {}, (o) => {});
		subject._handleException = function () { isHandlerInvoked = true; };
		
		var obj = new TestModule();
		var obj2 = new TestModule();
		
		obj.onLoad = function() { throw 'Error'; };
		obj2.onLoad = function() { sameMethodCalled = true; };
		obj.postLoad = function() { diffMethodCalled = true; };
		
		subject.execute([obj, obj2], []);
		
		assert.equal(true, isHandlerInvoked);
		assert.equal(true, diffMethodCalled);
		assert.equal(true, sameMethodCalled);
	});
	
	
	test('error handling sanity', () => 
	{
		var original = console.error;
		var subject = new LoadSequence();
		
		try
		{
			console.error = () => {};
			subject._handleException('a', 'b', 'c');
		}
		finally 
		{
			console.error = original;
		}
	});
});