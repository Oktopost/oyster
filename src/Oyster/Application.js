namespace('Oyster', function (root)
{
	var is = root.Plankton.is;
	var classify = root.Classy.classify;
	
	var ModuleManager = root.Oyster.ModuleManager;
	var OysterModules = root.Oyster.Modules.OysterModules;


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
		
		this._modules = new ModuleManager(this);
		this._baseUrl = null;
	}
	
	
	Application.prototype._processBaseUrl = function()
	{
		if (is.function(this._baseUrl))
			return this._baseUrl();
		
		if (is.string(this._baseUrl))
			return this._baseUrl;
		
		try
		{
			return this._baseUrl.toString();
		}
		catch (e)
		{
			return '/';
		}
	};
	
	Application.prototype._getDefaultUrl = function()
	{
		return window.location.pathname + window.location.search;
	};
	
	Application.prototype._getBaseUrl = function()
	{
		return is(this._baseUrl) ? this._processBaseUrl() : this._getDefaultUrl();
	};
	
	
	Application.prototype.setBaseUrl = function(closure)
	{
		this._baseUrl = closure;
	};
	
	/**
	 * @param {string|*=} config
	 * @return {ModuleManager|Application|null|Module|*}
	 */
	Application.prototype.modules = function (config)
	{
		if (!is(config)) return this._modules;
		else if (is.string(config)) return this._modules.get(config);
		else if (is.function(config))
		{
			if (is.string(config.moduleName)) return this._modules.get(config.moduleName);
			else if (is.function(config.moduleName)) return this._modules.get(config.moduleName());
		}
		
		this._modules.add(config);
		return this;
	};
	
	/**
	 * Start the application. Should be called after modules and routes configured.
	 */
	Application.prototype.run = function ()
	{
		this._modules.onLoaded((function ()
			{
				/** @var {BaseRoutingModule} */
				var actionsModule = this.modules(OysterModules.RoutingModule);
				actionsModule.handleURL(this._getBaseUrl());
			})
			.bind(this));
	};
	
	
	/**
	 * Navigation and Routing modules must be passed to this function.
	 * @param {Module|[Module]} modules
	 * @param {function(Application, BaseRoutingModule)} callback
	 * @return {Application}
	 */
	Application.create = function (modules, callback)
	{
		var app = new Application();
		
		app.modules(modules);
		app.modules().onLoaded(
			function ()
			{
				/** @var {BaseRoutingModule} actionsModule */
				var actionsModule = app.modules(OysterModules.RoutingModule);
				callback(app, actionsModule);
			}
		);
		
		return app;
	};
	
	
	this.Application = Application;
});