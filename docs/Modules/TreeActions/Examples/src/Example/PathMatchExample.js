namespace('Example', function (window)
{
	var TreeActionsModule			= window.Oyster.Modules.Routing.TreeActionsModule;
	var HistoryJsNavigationModule	= window.Example.Modules.HistoryJsNavigationModule;
	
	var Application		= window.Oyster.Application;
	var PathMatchRoutes	= window.Example.PathMatch.PathMatchRoutes;
	
	
	this.PathMatchExample = function ()
	{
		Application.create(
			[
				HistoryJsNavigationModule,
				TreeActionsModule
			], 
			function setupApplication(app, routing)
			{
				routing.setupRoutes(PathMatchRoutes);
				app.run();
			});
	};
});