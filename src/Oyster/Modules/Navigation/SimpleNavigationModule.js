namespace('Oyster.Modules.Navigation', function (window) 
{
	var is	= window.Plankton.is;
	var url	= window.Plankton.url;
	
	var inherit 	= window.Classy.inherit;
	var classify 	= window.Classy.classify;
	
	var OysterModules			= window.Oyster.Modules.OysterModules;
	var BaseNavigationModule	= window.Oyster.Modules.BaseNavigationModule;
	
	
	/**
	 * @class {Oyster.Modules.Navigation.SimpleNavigationModule}
	 * @alias {SimpleNavigationModule}
	 * 
	 * @extends {BaseNavigationModule}
	 */
	function SimpleNavigationModule() 
	{
		classify(this);
		
		this._setupCallback			= null;
		this._handleMissCallback	= null;
	}
	
	
	inherit(SimpleNavigationModule, BaseNavigationModule);
	SimpleNavigationModule.moduleName = BaseNavigationModule.moduleName;
	
	
	SimpleNavigationModule.prototype._bindEvents = function ()
	{
		var navigate 	= this.navigate;
		var handleURL 	= this._routing.handleURL;
		
		$(window).on('popstate', function (e)
		{			
			handleURL(window.location.pathname + window.location.search);
		});
		
		$(document).on('click', 'a', function (e) 
		{
			e.preventDefault();
			navigate($(this).attr('href'));
		});
	};

	
	SimpleNavigationModule.prototype.setHandleMissCallback = function (callback)
	{
		this._handleMissCallback = callback;
	};
	
	SimpleNavigationModule.prototype.setInitCallback = function (callback)
	{
		this._setupCallback = callback;
	};
	
	SimpleNavigationModule.prototype.preLoad = function ()
	{
		/** @var {BaseRoutingModule} */
		this._routing = this.manager().get(OysterModules.RoutingModule);
		this._bindEvents();
		
		if (is(this._setupCallback))
		{
			this._setupCallback(this, this._routing);
		}
	};
	
	
	SimpleNavigationModule.prototype.navigate = function (path)
	{
		history.pushState(null, null, path);
		this._routing.handleURL(path);
	};

	SimpleNavigationModule.prototype.goto = function (path, params)
	{
		this.navigate(url.encode(path, params || {}));
	};
	
	SimpleNavigationModule.prototype.handleMiss = function (path)
	{
		if (is(this._handleMissCallback))
		{
			this._handleMissCallback(this, path);
		}
		else 
		{
			console.error('Could not handle URL: ' + path);
		}
	};
	
	
	SimpleNavigationModule.create = function (param)
	{
		var module = new SimpleNavigationModule();
		
		
		if (is(param.handleMiss))
		{
			if (is.string(param.handleMiss))
			{
				module.setHandleMissCallback(function(module) 
				{
					module.goto(param.handleMiss);
				});
			}
			else if (is.function(param.handleMiss))
			{
				module.setHandleMissCallback(param.handleMiss);
			}
			else 
			{
				throw new Error('handleMiss option must be a string or a callback');
			}
		}
		
		if (is(param.init))
		{
			if (is.function(param.init))
			{
				module.setInitCallback(param.init);
			}
			else 
			{
				throw new Error('handleMiss option must be a string or a callback');
			}
		}
		
		
		return module;
	};
	
	
	this.SimpleNavigationModule = SimpleNavigationModule;
});