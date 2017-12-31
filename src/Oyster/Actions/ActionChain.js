namespace('Oyster.Actions', function (root)
{
	var is		= root.Plankton.is;
	var obj		= root.Plankton.obj;
	var foreach	= root.Plankton.foreach;
	
	var ActionChainLink		= root.Oyster.Actions.ActionChainLink;
	var ActionChainLoader	= root.Oyster.Actions.ActionChainLoader;
	
	
	/**
	 * @class {Oyster.Actions.ActionChain}
	 * @alias {ActionChain}
	 * 
	 * @property {TreeActionsModule}	_module
	 * @property {Navigator}			_navigator
	 * @property {[ActionChainLink]}	_chain
	 * @property {ActionRoute}			_route
	 * @property {*}					_params
	 * 
	 * @param {TreeActionsModule} module
	 * 
	 * @constructor
	 */
	function ActionChain(module)
	{
		this._module	= module;
		this._navigator	= module.navigator();
		this._chain		= [];
		this._params	= {};
		this._route		= null;
	}
	
	
	/**
	 * @param {ActionRoute} actionRoute
	 * @param {{}} target
	 * @private
	 */
	ActionChain.prototype._findModified = function (actionRoute, target)
	{
		var prevActionConstructor = (this._route ? this._route.actions() : []);
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
		var paramNames = (this._route ? this._route.params() : []);
		
		for (foundIndex = 0; foundIndex < target.modified.length; foundIndex++)
		{
			foreach(paramNames[foundIndex], this, function (paramName) 
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
			});
			
			if (found) break;
		}
		
		if (foundIndex === 0)
			target.unmodified = [];
		else
			target.unmodified = target.modified.splice(0, foundIndex);
	};
	
	/**
	 * @param {{}} target
	 * @private
	 */
	ActionChain.prototype._findUnmounted = function (target)
	{
		var length = target.modified.length + target.unmodified.length;
		
		target.unmount = this._chain.slice(
			length, 
			this._chain.length
		);
	};
	
	/**
	 * @param {ActionRoute} actionRoute
	 * @param {{}} target
	 * @private
	 */
	ActionChain.prototype._findMounted = function (actionRoute, target)
	{
		var length = target.modified.length + target.unmodified.length;
		var creators = actionRoute.actions();
		
		target.mount = [];
		
		for (var index = length; index < creators.length; index++)
		{
			var action = new creators[index]();
			var chainLink = new ActionChainLink(action); 
			
			action.setModuleManager(this._module.manager());
			action.setNavigator(this._navigator);
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
		
		foreach(this._chain, this, 
			/**
			 * @param {ActionChainLink} item
			 */
			function (item) 
			{
				ActionChainLink.updateRelations(
					item,
					(index === last ? null : this._chain[index + 1]),
					(index === 0 ? null : this._chain[index - 1])
				);
				
				ActionChainLink.setApp(item, this._module.app());
				
				item.action().setParams(params);
				
				index++;
			});
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
		var prevParams = obj.copy(this._params); 
		
		ActionChainLoader.invokePreDestroy(target.unmount, params, this._params);
		
		this._unmount(target.unmount);
		this._updateChainState(target, params, actionRoute);
		
		ActionChainLoader.invokeInitialize(target.mount, this._params, prevParams);
		ActionChainLoader.invokeRefresh(target.unmodified, this._params, prevParams);
		ActionChainLoader.invokeUpdate(target.modified, this._params, prevParams);
		ActionChainLoader.invokeActivate(target.mount, this._params, prevParams);
		
		ActionChainLoader.invokeDestroy(target.unmount, this._params, prevParams);
	};
	
	
	/**
	 * @return {Array.<ActionChainLink>|null}
	 */
	ActionChain.prototype.chain = function ()
	{
		return this._chain;
	};
	
	/**
	 * @return {ActionRoute|null}
	 */
	ActionChain.prototype.route = function ()
	{
		return this._route;
	};
	
	/**
	 * @return {*}
	 */
	ActionChain.prototype.params = function ()
	{
		return this._params;
	};
	
	
	this.ActionChain = ActionChain;
});