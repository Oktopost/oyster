namespace('Oyster.Actions', function (root)
{
	var is		= root.Plankton.is;
	var foreach	= root.Plankton.foreach;
	
	var ActionChainLink		= root.Oyster.Actions.ActionChainLink;
	var ActionChainLoader	= root.Oyster.Actions.ActionChainLoader;
	
	
	/**
	 * @class Oyster.Actions.ActionChain
	 * @alias {ActionChain}
	 * 
	 * @property {[ActionChainLink]}	_chain
	 * @property {ActionRoute}			_route
	 * @property {*}					_params
	 * 
	 * @constructor
	 */
	function ActionChain()
	{
		this._chain		= [];
		this._params	= {};
		this._route		= null;
	}
	
	
	/**
	 * @param {ActionRoute} actionRoute
	 * @param {{}} target
	 * @private
	 */
	Action.prototype._findModified = function (actionRoute, target)
	{
		var prevActionConstructor = this._route || [];
		var currActionConstructor = actionRoute.actions();
		var maxIndex = Math.min(prevActionConstructor.length, currActionConstructor.length);
		
		target.modified = [];
		
		for (var index = 0 ; index < maxIndex; index++)
		{
			if (prevActionConstructor[index] !== currActionConstructor[index]) break;
			
			target.modified.push(this._chain[index]);
		}
	};
	
	/**
	 * @param {{}} target
	 * @param {*} params
	 * @private
	 */
	ActionChain.prototype._findUnmodified = function (target, params)
	{
		var foundIndex;
		var checked = {};
		var found = false;
		var paramNames = this._route.params();
		
		for (foundIndex = 0; foundIndex < target.modified.length; foundIndex++)
		{
			foreach(paramNames, function (paramName) 
			{
				if (is(checked[paramName]))
				{
					return true;
				}
				else if (this._params[paramName] === params[paramName])
				{
					checked[paramName] = true;
				}
				else 
				{
					found = true;
					return false;
				}
			}, this);
			
			if (found) break;
		}
		
		if (foundIndex === target.modified.length)
			target.unmodified = [];
		else
			target.unmodified = target.modified.splice(0, foundIndex);
	};
	
	/**
	 * @param {{}} target
	 * @private
	 */
	Action.prototype._findUnmounted = function (target)
	{
		var length = target.modified.length + target.unmodified.length;
		
		target.unmount = this._chain.slice(
			length, 
			this._chain.length - length
		);
	};
	
	/**
	 * @param {ActionRoute} actionRoute
	 * @param {{}} target
	 * @private
	 */
	Action.prototype._findMounted = function (actionRoute, target)
	{
		var length = target.modified.length + target.unmodified.length;
		var creators = actionRoute.actions();
		
		target.mount = [];
		
		for (var index = length; index < creators.length; index++)
		{
			var action = new creators[index]();
			var chainLink = new ActionChainLink(action); 
			
			target.mount.push(chainLink);
		}
	};
	
	/**
	 * @param {{}} target
	 * @param {*} params
	 * @param {ActionRoute} route
	 * @private
	 */
	ActionChain.prototype._updateChainState = function (target, params, route)
	{
		this._chain		= [].concat(target.unmodified, target.modified, target.mount);
		this._params	= params;
		this._route		= route;
		
		var index = 0;
		var last = this._chain.length - 1;
		
		foreach(this._chain,
			/**
			 * @param {ActionChainLink} item
			 */
			function (item) 
			{
				ActionChainLink.updateRelations(
					item,
					(index === 0 ? null : this._chain[index - 1]),
					(index === last ? null : this._chain[index + 1])
				);
				
				item.action().setParams(params);
				
				index++;
			},
			this);
	};
	
	/**
	 * @param {{ unmount: [ActionChainLink] }} target
	 * @private
	 */
	ActionChain.prototype._unmount = function (target)
	{
		foreach(target, function (item) { ActionChainLink.unmount(item); });
	};
	
	/**
	 * @param {ActionRoute} actionRoute
	 * @param {*} params
	 */
	ActionChain.prototype._buildChangesObject = function (actionRoute, params)
	{
		var target = {};
		
		this._findModified(actionRoute, target);
		this._findUnmodified(target, params);
		this._findUnmounted(target);
		this._findMounted(actionRoute, target);
		
		return target;
	};
	
	
	/**
	 * @param {ActionRoute} actionRoute
	 * @param {*} params
	 */
	ActionChain.prototype.update = function (actionRoute, params)
	{
		var target = this._buildChangesObject(actionRoute, params);
		var prevParams = this._params; 
		
		ActionChainLoader.invokePreDestroy(target.unmount, params, this._params);
		
		this._unmount(target.unmount);
		this._updateChainState(target, params, actionRoute.route());
		
		ActionChainLoader.invokeChildUpdate(target.unmodified, this._params, prevParams);
		ActionChainLoader.invokeUpdate(target.modified, this._params, prevParams);
		ActionChainLoader.invokeInitialize(target.mount, this._params, prevParams);
		ActionChainLoader.invokeActivate(target.mount, this._params, prevParams);
		
		ActionChainLoader.invokeDestroy(target.unmount, this._params, prevParams);
	};
	
	
	this.ActionChain = ActionChain;
});