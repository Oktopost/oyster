namespace('Oyster.Routing', function (root)
{
	/**
	 * @name {Oyster.Routing.ActionRoute}
	 * @alias ActionRoute
	 * 
	 * @property {SeaRoute.Route.Route} _route
	 * @property {[string]}				_params
	 * @property {[callback]}			_actions
	 * 
	 * @constructor
	 */
	function ActionRoute()
	{
		this._actions	= null;
		this._params	= null;
		this._route		= null;
	}
	
	
	/**
	 * @param {[]} actions
	 * @param {[]} params
	 */
	ActionRoute.prototype.setActions = function (actions, params)
	{
		this._actions	= actions.concat();
		this._params	= params.concat();
	};
	
	/**
	 * @param {SeaRoute.Route.Route} route
	 */
	ActionRoute.prototype.setRoute = function (route)
	{
		this._route = route;
	};
	
	/**
	 * @return {SeaRoute.Route.Route}
	 */
	ActionRoute.prototype.route = function ()
	{
		return this._route;
	};
	
	/**
	 * @return {[callback]}
	 */
	ActionRoute.prototype.actions = function ()
	{
		return this._actions.concat();
	};
	
	/**
	 * @return {[string]}
	 */
	ActionRoute.prototype.params = function ()
	{
		return this._params.concat();
	};
	
	
	this.ActionRoute = ActionRoute;
});