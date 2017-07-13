const root = require('../../../index');
const assert = require('chai').assert;


const OysterModules			= root.Oyster.Modules.OysterModules;
const BaseNavigationModule	= root.Oyster.Modules.BaseNavigationModule;


suite('BaseNavigationModule', () => 
{
	test('sanity', () => 
	{
		var subject = new BaseNavigationModule();
		
		subject.navigate();
		subject.handleMiss();
		
		assert.equal(BaseNavigationModule.prototype.moduleName(), OysterModules.NavigationModule);
	});
});