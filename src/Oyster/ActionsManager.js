namespace('Oyster', function (root)
{
	var func	= root.Plankton.func;
	
	var classify		= root.Classy.classify;
	var Router			= root.SeaRoute.Router;
	var RoutesBuilder	= root.SeaRoute.RoutesBuilder;
	
	var ActionChain			= root.Oyster.Actions.ActionChain;
	var Navigator			= root.Oyster.Routing.Navigator;
	var RoutingConfigParser	= root.Oyster.Routing.RoutingConfigParser;
	

	/**
	 * @class {Oyster.ActionsManager}
	 * @alias {ActionsManager}
	 * 
	 * @param {function(string)} navigateCallback
	 * @param {function(string)} missHandler
	 * 
	 * @property {ActionChain}		_chain
	 * @property {SeaRoute.Router}	_router
	 * 
	 * @constructor
	 */
	function ActionsManager(navigateCallback, missHandler)
	{
		classify(this);
		
		this._builder	= new RoutesBuilder();
		this._router	= new Router(navigateCallback, missHandler);
		this._navigator	= new Navigator(this._router);
		this._chain		= new ActionChain(this._navigator);
	}
	
	/**
	 * @param {ActionRoute} actionRoute
	 * @param {*} params
	 */
	ActionsManager.prototype.handle = function (actionRoute, params)
	{
		this._chain.update(actionRoute, params);
	};
	
	/**
	 * @param {string} url
	 */
	ActionsManager.prototype.handleURL = function (url)
	{
		(func.async(this._router.handle(url)))();
	};
	
	/**
	 * @param {*} params
	 */
	ActionsManager.prototype.setupPredefinedParams = function (params)
	{
		this._builder.addParams(params);
	};
	
	ActionsManager.prototype.setupRoutes = function (config)
	{
		return RoutingConfigParser.parse(this, config, this._builder);
	};
	
	/**
	 * @return {{addPredefinedParams: addPredefinedParams, addRoutes: (ActionsManager.setupRoutes|*), handle: handle}}
	 */
	ActionsManager.prototype.setup = function ()
	{
		var self = this;
		var object = {
			addPredefinedParams: function (params) { self.setupPredefinedParams(params); return object; },
			addRoutes: this.setupRoutes
		};
		
		return object;
	};
	
	
	this.ActionsManager = ActionsManager;
});