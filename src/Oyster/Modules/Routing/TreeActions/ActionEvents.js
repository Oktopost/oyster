namespace('Oyster.Modules.Routing.TreeActions', function (root)
{
	var classify 	= root.Classy.classify;
	
	var Event		= root.Duct.Event; 
	var Listener	= root.Duct.Listener;
	
	
	/**
	 * @class {Oyster.Modules.Routing.TreeActions.ActionEvents}
	 * @alias {ActionEvents}
	 * 
	 * @constructor
	 */
	function ActionEvents()
	{
		this._onDestroy = new Event('Action onDestroy Event');
		
		classify(this);
	}
	
	
	/**
	 * @param {Event} event
	 * @param {*|function=} callback
	 * @param {function=} item
	 * @return {Duct.Listener|*}
	 * @private
	 */
	ActionEvents.prototype._getListener = function (event, callback, item)
	{
		var listener = new Listener(event);
		
		if (callback) listener.add(callback, item);
		
		return listener;
	};
	
	
	/**
	 * @param {*|function=} callback
	 * @param {function=} item
	 * @return {Duct.Listener|*}
	 */
	ActionEvents.prototype.onDestroy = function (callback, item)
	{
		return this._getListener(this._onDestroy, callback, item);
	};
	
	
	ActionEvents.prototype.triggerDestroy = function () 
	{
		this._onDestroy.trigger();
		this._onDestroy.destroy();
	};
	
	
	this.ActionEvents = ActionEvents;
});