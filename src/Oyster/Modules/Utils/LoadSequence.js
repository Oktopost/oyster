namespace('Oyster.Modules.Utils', function (root)
{
	var foreach		= root.Plankton.foreach;
	var classify	= root.Classy.classify;


	/**
	 * @class Oyster.Modules.Utils.LoadSequence
	 * @alias LoadSequence
	 * 
	 * @param {callback} onLoadCallback
	 * @param {callback} onUnloadCallback
	 * 
	 * @constructor
	 */
	function LoadSequence(onLoadCallback, onUnloadCallback)
	{
		classify(this);
		
		this._onLoadCallback	= onLoadCallback;
		this._onUnloadCallback	= onUnloadCallback;
	}

	/**
	 * @param {string} method
	 * @param {Module} module
	 * @param {Error} error
	 * @private
	 */
	LoadSequence.prototype._handleException = function (method, module, error)
	{
		console.error('Failed to invoke method ' + method + ' on module', module, error);
	};

	/**
	 * @param {Module[]} set
	 * @param {string} method
	 * @private
	 */
	LoadSequence.prototype._invoke = function (set, method)
	{
		foreach(set, this, function (module)
		{
			try 
			{
				module[method]();
			}
			catch (error)
			{
				this._handleException(method, module, error);
			}
		});
	};

	/**
	 * @param {Module[]} set
	 * @param {boolean} flag
	 * @private
	 */
	LoadSequence.prototype._setIsLoaded = function (set, flag)
	{
		foreach(set, function (module) { module.control().setIsLoaded(flag); });
	};

	/**
	 * @param {Module[]} modules
	 * @private
	 */
	LoadSequence.prototype._destroyLT = function (modules)
	{
		foreach(modules, function (module) { module.LT().kill(); });
	};

	/**
	 * @param {Module[]} toLoad
	 * @param {Module[]} toUnload
	 */
	LoadSequence.prototype.execute = function(toLoad, toUnload)
	{
		this._invoke(toLoad, 'initialize');
		
		this._invoke(toUnload, 'preUnload');
		this._setIsLoaded(toUnload, false);
		this._destroyLT(toUnload, false);
		this._invoke(toUnload, 'onUnload');
		
		foreach(toUnload, this, function (module) { this._onUnloadCallback(module); });
		this._invoke(toUnload, 'postUnload');
		foreach(toLoad, this, function (module) { this._onLoadCallback(module); });
		
		this._invoke(toLoad, 'preLoad');
		this._setIsLoaded(toLoad, true);
		this._invoke(toLoad, 'onLoad');
		this._invoke(toLoad, 'postLoad');
		
		this._invoke(toUnload, 'destroy');
	};
	
	
	this.LoadSequence = LoadSequence;
});