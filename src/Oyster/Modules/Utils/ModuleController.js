namespace('Oyster.Modules.Utils', function (root)
{
	var classify = root.Classy.classify;

	
	/**
	 * @name {Oyster.Modules.Utils.ModuleController}
	 * @alias {ModuleController}
	 * 
	 * @property {ModuleManager}	_manager
	 * @property {string}			_name
	 * @property {boolean}			_isLoaded
	 * 
	 * @param {Application} app
	 * @param {string} name
	 * 
	 * @constructor
	 */
	function ModuleController(app, name)
	{
		classify(this);
		
		this._name		= name;
		this._app		= app;
		this._manager	= app.modules();
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
	
	/**
	 * @return {ModuleManager}
	 */
	ModuleController.prototype.manager = function ()
	{
		return this._manager;
	};
	
	/**
	 * @return {Application}
	 */
	ModuleController.prototype.app = function ()
	{
		return this._app;
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