namespace('Oyster', function (root)
{
	var is = root.Plankton.is;
	var classify = root.Classy.classify;
	
	var ModuleManager = root.Oyster.ModuleManager;
	var ActionsManager = root.Oyster.ActionsManager;
	
	var BaseNavigationModule = root.Oyster.Modules.BaseNavigationModule;


	/**
	 * @class {Oyster.Application}
	 * @alias {Application}
	 * 
	 * @property {ModuleController} _controller
	 * 
	 * @constructor
	 */
	function Application()
	{
		classify(this);
		
		this._modules = new ModuleManager();
		this._actions = new ActionsManager(this._handleNavigation, this._handleRouteNotFound);
	}
	
	
	/**
	 * @param {string} url
	 * @private
	 */
	Application.prototype._handleNavigation = function (url)
	{
		/** @var {BaseNavigationModule} navigationModule */
		var navigationModule = this._modules.get(BaseNavigationModule);
		navigationModule.navigate(url);
	};
	
	/**
	 * @param {string} url
	 * @private
	 */
	Application.prototype._handleRouteNotFound = function (url)
	{
		/** @var {BaseNavigationModule} navigationModule */
		var navigationModule = this._modules.get(BaseNavigationModule);
		navigationModule.handleMiss(url);
	};
	
	/**
	 * @return {{addPredefinedParams: addPredefinedParams, addRoutes: (ActionsManager.setupRoutes|*), handle: handle}}
	 */
	Application.prototype.routing = function ()
	{
		return this._actions.setup();
	};
	
	/**
	 * @param {string|*=} config
	 * @return {*}
	 */
	Application.prototype.modules = function (config)
	{
		if (!is(config)) return this._modules;
		else if (is.string(config)) return this._modules.get(config);
		else
		{
			this._modules.add(config);
			return this;
		}
	};
	
	/**
	 * @return {ActionsManager}
	 */
	Application.prototype.actions = function ()
	{
		return this._actions;
	};
	
	/**
	 * Start the application. Should be called after modules and routes configured.
	 */
	Application.prototype.run = function ()
	{
		this._modules.onLoaded((function ()
			{
				this._actions.handleURL(window.location.href);
			})
			.bind(this));
	};
	
	
	this.Application = Application;
});