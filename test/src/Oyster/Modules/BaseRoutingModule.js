const root = require('../../../index');
const assert = require('chai').assert;


const OysterModules			= root.Oyster.Modules.OysterModules;
const BaseRoutingModule		= root.Oyster.Modules.BaseRoutingModule;


suite('BaseRoutingModule', () => 
{
	test('sanity', () => 
	{
		var subject = new BaseRoutingModule();
		
		subject.handleURL();
		subject.setupPredefinedParams();
		subject.setupRoutes();
		
		assert.equal(BaseRoutingModule.prototype.moduleName(), OysterModules.RoutingModule);
	});
});