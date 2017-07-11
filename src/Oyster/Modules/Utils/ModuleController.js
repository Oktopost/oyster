namespace('Oyster.Modules.Utils', function (root)
{
	var classify = root.Classy.classify;

	
	/**
	 * @name Oyster.Modules.Utils.ModuleController
	 * @alias ModuleController
	 * 
	 * @constructor
	 */
	function ModuleController(manager, name)
	{
		classify(this);
		
		this._name		= name;
		this._manager	= manager;
		this._isLoaded	= false;
	}


	/**
	 * @param {boolean} isLoaded
	 */
	ModuleController.prototype.setIsLoaded = function (isLoaded)
	{
		this._isLoaded = isLoaded;
	};

	/**
	 * @returns {string}
	 */
	ModuleController.prototype.name = function ()
	{
		return this._name;
	};
	
	ModuleController.prototype.manager = function ()
	{
		return this._manager;
	};
	
	ModuleController.prototype.unload = function ()
	{
		if (this._isLoaded)
		{
			this._manager.remove(this._name);
		}
	};
	
	/**
	 * @returns {boolean}
	 */
	ModuleController.prototype.isLoaded = function ()
	{
		return this._isLoaded;
	};
	
	
	this.ModuleController = ModuleController;
});