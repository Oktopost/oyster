namespace('Oyster.Actions', function (root)
{
	var is		= root.Plankton.is;
	var func	= root.Plankton.func;
	var foreach	= root.Plankton.foreach;
	
	
	var ActionChainLoader = {
		
		/**
		 * 
		 * @param action
		 * @param {string} method
		 * @param {{}=} params
		 * @private
		 */
		_invokeMethod: function (action, method, params)
		{
			if (!is(action[method]))
				return;
			
			try
			{
				action[method](params);
			}
			catch (e) 
			{
				console.log('Error', e);
			}
		},
		
		/**
		 * @param {[Action]} on
		 * @private
		 */
		_invokeDestroy: func.async(function (on)
		{
			foreach(on, function (item)
			{
				ActionChainLoader._invokeMethod(item, 'destroy');
			});
		}),
		
		
		/**
		 * @param unchanged
		 * @param newActions
		 * @param oldActions
		 * @param params
		 */
		load: function (unchanged, newActions, oldActions, params)
		{
			
			ActionChainLoader._invokeDestroy(oldActions);
		}
	};
	
	
	this.ActionChainLoader = ActionChainLoader;
});