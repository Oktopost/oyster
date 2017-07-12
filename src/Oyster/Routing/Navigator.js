namespace('Oyster.Routing', function (root)
{
	var is		= root.Plankton.is;
	var func	= root.Plankton.func;
	
	var Route		= root.SeaRoute.Route.Route;
	var ActionRoute	= root.Oyster.Routing.ActionRoute;
	
	
	/**
	 * @name {Oyster.Routing.Navigator}
	 * @alias {Navigator}
	 * 
	 * @property {SeaRoute.Router} _router
	 * @property {callback} _navigationOrder
	 * 
	 * @param {SeaRoute.Router} router
	 * 
	 * @constructor
	 */
	function Navigator(router)
	{
		this._router = router;
		this._navigationOrder = null;	
	}
	
	
	Navigator.prototype._getRouterTarget = function (target)
	{
		if (is.string(target) || target instanceof Route)
		{
			return target;
		}
		else if (target instanceof ActionRoute)
		{
			return target.route();
		}
		else if (is.object(target) && is(target['$']) && target['$'] instanceof ActionRoute)
		{
			return target['$'].route();
		}
		else 
		{
			console.error('Invalid target: ', target);
			throw Error('Invalid target supplied');
		}
	};
	
	/**
	 * @param {*} target
	 * @param {{}} params
	 * @private
	 */
	Navigator.prototype._goto = function (target, params)
	{
		target = this._getRouterTarget(target);
		this._router.navigate(target, params);
	};
	
	
	/**
	 * @param {*} target
	 * @param {{}=} params
	 * @return {Promise}
	 */
	Navigator.prototype.goto = function (target, params)
	{
		this._navigationOrder = (function() { this._goto(target, params); }).bind(this);
		
		return func.async.do((function () 
			{
				if (this._navigationOrder === null) return;
				
				var order = this._navigationOrder;
				this._navigationOrder = null;
				
				order();
			})
			.bind(this));
	};
	
	/**
	 * @param {*} target
	 * @param {{}=} params
	 * @return {string}
	 */
	Navigator.prototype.link = function (target, params)
	{
		target = this._getRouterTarget(target);
		return this._router.link(target, params);
	};
	
	
	this.Navigator = Navigator;
});