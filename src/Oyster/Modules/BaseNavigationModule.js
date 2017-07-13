namespace('Oyster.Modules', function (root)
{
	var inherit = root.Classy.inherit;
	
	var Module			= root.Oyster.Module;
	var OysterModules	= root.Oyster.Modules.OysterModules;
	

	/**
	 * @name {Oyster.Modules.BaseNavigationModule}
	 * @alias {NavigationModule}
	 */
	function BaseNavigationModule()
	{
		
	}
	
	
	inherit(BaseNavigationModule, Module);
	
	
	BaseNavigationModule.prototype.navigate = function (url) {};
	BaseNavigationModule.prototype.handleMiss = function (url) {};
	
	
	BaseNavigationModule.moduleName = function () 
	{
		return OysterModules.NavigationModule; 
	};
	
	
	this.BaseNavigationModule = BaseNavigationModule;
});