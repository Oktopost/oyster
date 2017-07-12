namespace('Oyster.Actions', function (root)
{
	var is		= root.Plankton.is;
	var func	= root.Plankton.func;
	var array	= root.Plankton.array;
	var foreach	= root.Plankton.foreach;
	
	
	/**
	 * @name {Oyster.Actions.ActionChainLoader}
	 * @alias {ActionChainLoader}
	 */
	var ActionChainLoader = {
		
		/**
		 * @param {Error} error
		 * @param {string} method
		 * @param {string} name
		 * @private
		 */
		_errorHandler: function (error, method, name)
		{
			console.error('Error thrown while invoking "' + method + '" on action ' + name, error);
		},
		
		/**
		 * 
		 * @param action
		 * @param {string} method
		 * @param {[]|*} params
		 * @private
		 */
		_invokeMethod: function (action, method, params)
		{
			var name;
			
			if (!is(action[method]))
				return;
			
			try
			{
				action[method].apply(action, array(params));
			}
			catch (e) 
			{
				if (is.function(action.name))
					name = action.name();
				else if (is.function(action.constructor.name))
					name = action.constructor.name();
				else
					name = '[unknown]';
				
				ActionChainLoader._errorHandler(e, method, name);
			}
		},
		
		
		/**
		 * @param {[ActionChainLink]} actions
		 * @param {*} params
		 * @param {*} prevParams
		 * @private
		 */
		invokePreDestroy: function (actions, params, prevParams)
		{
			foreach(actions, function (item)
			{
				ActionChainLoader._invokeMethod(item.action(), 'preDestroy', [params, prevParams]);
			});
		},
		
		/**
		 * @param {[ActionChainLink]} actions
		 * @param {*} params
		 * @param {*} prevParams
		 * @private
		 */
		invokeRefresh: function (actions, params, prevParams)
		{
			foreach(actions, function (item)
			{
				ActionChainLoader._invokeMethod(item.action(), 'refresh', [params, prevParams]);
			});
		},
		
		/**
		 * @param {[ActionChainLink]} actions
		 * @param {*} params
		 * @param {*} prevParams
		 */
		invokeUpdate: function (actions, params, prevParams)
		{
			foreach(actions, function (item)
			{
				ActionChainLoader._invokeMethod(item.action(), 'update', [params, prevParams]);
				ActionChainLoader._invokeMethod(item.action(), 'execute', [params, prevParams]);
			});
		},
		
		/**
		 * @param {[ActionChainLink]} actions
		 * @param {*} params
		 * @param {*} prevParams
		 */
		invokeInitialize: function (actions, params, prevParams)
		{
			foreach(actions, function (item)
			{
				ActionChainLoader._invokeMethod(item.action(), 'initialize', [params, prevParams]);
			});
		},
		
		/**
		 * @param {[ActionChainLink]} actions
		 * @param {*} params
		 * @param {*} prevParams
		 */
		invokeActivate: function (actions, params, prevParams)
		{
			foreach(actions, function (item)
			{
				ActionChainLoader._invokeMethod(item.action(), 'activate', [params, prevParams]);
				ActionChainLoader._invokeMethod(item.action(), 'execute', [params, prevParams]);
			});
		},
		
		/**
		 * @param {[ActionChainLink]} on
		 * @param {*} params
		 * @param {*} prevParams
		 * @return {Promise}
		 * @private
		 */
		invokeDestroy: function (on, params, prevParams)
		{
			return func.async.do(function ()
			{
				foreach(on, function (item)
				{
					ActionChainLoader._invokeMethod(item.action(), 'destroy', [params, prevParams]);
				});
			});
		}
	};
	
	
	this.ActionChainLoader = ActionChainLoader;
});