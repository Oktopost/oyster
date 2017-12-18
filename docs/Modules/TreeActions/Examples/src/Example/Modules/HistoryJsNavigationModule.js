namespace('Example.Modules', function (window) 
{
	var url		= window.Plankton.url;
	
	var inherit 	= window.Classy.inherit;
	var classify 	= window.Classy.classify;
	
	var OysterModules			= window.Oyster.Modules.OysterModules;
	var BaseNavigationModule	= window.Oyster.Modules.BaseNavigationModule;
	
	
	/**
	 * @class {Oktopost.Modules.Navigation.HistoryJsNavigationModule}
	 * @alias {HistoryJsNavigationModule}
	 * 
	 * @extends {BaseNavigationModule}
	 */
	function HistoryJsNavigationModule() { classify(this); }
	
	
	inherit(HistoryJsNavigationModule, BaseNavigationModule);
	HistoryJsNavigationModule.moduleName = BaseNavigationModule.moduleName;
	
	
	HistoryJsNavigationModule.prototype._bindEvents = function ()
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


	HistoryJsNavigationModule.prototype.preLoad = function ()
	{
		/** @var {BaseRoutingModule} */
		this._routing = this.manager().get(OysterModules.RoutingModule);
		this._bindEvents();
	};
	
	
	HistoryJsNavigationModule.prototype.navigate = function (path)
	{
		console.log('Navigating to: ' + path);

		history.pushState(null, null, path);
		this._routing.handleURL(path);
	};

	HistoryJsNavigationModule.prototype.goto = function (path, params)
	{
		this.navigate(url.encode(path, params || {}));
	};
	
	HistoryJsNavigationModule.prototype.handleMiss = function (path)
	{
		console.error('Could not handle URL: ' + path);
	};
	
	
	this.HistoryJsNavigationModule = HistoryJsNavigationModule;
});