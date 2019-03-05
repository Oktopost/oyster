namespace('Oyster.Modules.Routing', function (root)
{
	var func	= root.Plankton.func;
	
	var classify	= root.Classy.classify;
	var inherit		= root.Classy.inherit;
	
	var Router			= root.SeaRoute.Router;
	var RoutesBuilder	= root.SeaRoute.RoutesBuilder;
	
	var ActionChain			= root.Oyster.Actions.ActionChain;
	var Navigator			= root.Oyster.Routing.Navigator;
	var RoutingConfigParser	= root.Oyster.Routing.RoutingConfigParser;
	var BaseRoutingModule	= root.Oyster.Modules.BaseRoutingModule;
	var OysterModules		= root.Oyster.Modules.OysterModules;
	

	/**
	 * @class {Oyster.Modules.Routing.TreeActionsModule}
	 * @alias {TreeActionsModule}
	 * 
	 * @property {ActionChain}		_chain
	 * @property {SeaRoute.Router}	_router
	 * 
	 * @extends {BaseRoutingModule}
	 * 
	 * @constructor
	 */
	function TreeActionsModule()
	{
		BaseRoutingModule.call(this);
		
		
		classify(this);
		
		this._builder	= null;
		this._router	= null;
		this._navigator	= null;
		this._chain		= null;
	}
	
	
	inherit(TreeActionsModule, BaseRoutingModule);
	TreeActionsModule.moduleName = BaseRoutingModule.moduleName;
	
	
	TreeActionsModule.prototype.preLoad = function ()
	{
		/** @var {BaseNavigationModule} navModule */
		var navModule = this.manager().get(OysterModules.NavigationModule);
		
		this._builder	= new RoutesBuilder();
		this._router	= new Router(navModule.navigate.bind(navModule), navModule.handleMiss.bind(navModule));
		this._navigator	= new Navigator(this._router);
		this._chain		= new ActionChain(this);
	};
	
	
	/**
	 * @param {string} url
	 */
	TreeActionsModule.prototype.handleURL = function (url)
	{
		(func.async(this._router.handle(url)))();
	};
	
	
	/**
	 * @param {ActionRoute} actionRoute
	 * @param {*} params
	 */
	TreeActionsModule.prototype.handle = function (actionRoute, params)
	{
		this._chain.update(actionRoute, params);
	};
	
	/**
	 * @param {*} params
	 */
	TreeActionsModule.prototype.setupPredefinedParams = function (params)
	{
		this._builder.addParams(params);
	};
	
	/**
	 * @param {*} config
	 */
	TreeActionsModule.prototype.setupRoutes = function (config)
	{
		return RoutingConfigParser.parse(this, config, this._builder);
	};
	
	TreeActionsModule.prototype.reloadChain = function ()
	{
		return RoutingConfigParser.parse(this, config, this._builder);
	};
	
	
	/**
	 * @return {Navigator}
	 */
	TreeActionsModule.prototype.navigator = function ()
	{
		return this._navigator;
	};
	
	/**
	 * @return {SeaRoute.Router}
	 */
	TreeActionsModule.prototype.router = function ()
	{
		return this._router;
	};
	
	
	this.TreeActionsModule = TreeActionsModule;
});