namespace('Oyster.Modules', function (root)
{
	var inherit = root.Classy.inherit;
	
	var Module			= root.Oyster.Module;
	var OysterModules	= root.Oyster.Modules.OysterModules;
	

	/**
	 * @name {Oyster.Modules.BaseRoutingModule}
	 * @alias {BaseRoutingModule}
	 * 
	 * @extends {Oyster.Module}
	 */
	function BaseRoutingModule()
	{
		
	}
	
	
	inherit(BaseRoutingModule, Module);
	
	
	BaseRoutingModule.prototype.handleURL = function (url) {};
	
	/**
	 * @param {*} params
	 */
	BaseRoutingModule.prototype.setupPredefinedParams = function (params) {};
	
	/**
	 * @param {*} config
	 */
	BaseRoutingModule.prototype.setupRoutes = function (config) {};
	
	
	BaseRoutingModule.moduleName = function () { return OysterModules.RoutingModule; };
	BaseRoutingModule.prototype.moduleName = BaseRoutingModule.moduleName;
	
	
	this.BaseRoutingModule = BaseRoutingModule;
});