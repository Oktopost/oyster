namespace('Oyster.Routing', function (root)
{
	var obj				= root.Plankton.obj;
	var foreach			= root.Plankton.foreach;
	
	var RoutesBuilder	= root.SeaRoute.RoutesBuilder;
	var ActionRoute		= root.Oyster.Routing.ActionRoute;
	
	
	/**
	 * @name {Oyster.Routing.ParsingCursor}
	 * @alias ParsingCursor
	 * 
	 * 
	 * @property {[callback]}	_actions
	 * @property {[string]}		_pathParts
	 * @property {[{}]}			_paramsConfig
	 * 
	 * @property {ActionsManager}			_manager
	 * @property {SeaRoute.RoutesBuilder}	_builder
	 * 
	 * @param {ActionsManager}			manager
	 * @param {SeaRoute.RoutesBuilder=}	builder
	 * @constructor
	 */
	function ParsingCursor(manager, builder)
	{
		this._builder	= builder || (new RoutesBuilder()); 
		this._manager	= manager;
		
		this._actions		= [];
		this._paramNames	= [];
		this._pathParts		= [];
		this._paramsConfig	= [];
	}
	
	
	/**
	 * @param {SeaRoute.Route.Route} route
	 * @return {ActionRoute}
	 * @private
	 */
	ParsingCursor.prototype._createActionRoute = function (route) 
	{
		var actionRoute = new ActionRoute();
		
		actionRoute.setActions(this._actions, this._paramNames.concat());
		actionRoute.setRoute(route);
		
		return actionRoute;
	};
	
	/**
	 * @return {string}
	 */
	ParsingCursor.prototype._getPath = function ()
	{
		var path = '';
		
		foreach(this._pathParts, function (item)
		{
			if (item.length === 0 || item === '/')
				return;
			
			if (item[0] === '/')
				item = item.slice(1);
			
			if (item[item.length - 1] === '/')
				item = item.slice(0, item.length - 1);
				
			path += '/' + item;
		});
		
		return (path.length > 0 ? path : '/');
	};
	
	/**
	 * @return {{}}
	 */
	ParsingCursor.prototype._getParams = function ()
	{
		var res = {};
		
		foreach(this._paramsConfig, function (item)
		{
			obj.mix(res, item);
		});
		
		return res;
	};
	
	
	/**
	 * @param {{action: *, path: *, ...}} config
	 * @return {ActionRoute}
	 */
	ParsingCursor.prototype.parseRouteConfig = function (config)
	{
		var route;
		var action;
		var manager = this._manager;
		var routeConfig = obj.copy(config);
		
		// Push action and path.
		this._actions.push(routeConfig.action);
		this._pathParts.push(routeConfig.path);
		this._paramsConfig.push(routeConfig.params || {});
		
		// Setup the config that will be passed to the routes builder
		delete(routeConfig.action);
		
		routeConfig.path		= this._getPath();
		routeConfig.params		= this._getParams();
		routeConfig.callback	= function (params) { manager.handle(action, params); };
		
		// Create the route and push it to the top of the stack. This will extract the route parameters.
		route = this._builder.create(routeConfig);
		this._manager.router().appendRoutes(route);
		this._paramNames.push(route.paramNames());
		
		// Set the variable 'action' so that it's used in the callback.
		action = this._createActionRoute(route);
		return action;
	};
	
	ParsingCursor.prototype.pop = function ()
	{
		this._actions.pop();
		this._paramNames.pop();
		this._paramsConfig.pop();
		this._pathParts.pop();
	};
	
	
	this.ParsingCursor = ParsingCursor;
});