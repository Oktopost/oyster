namespace('Example', function (window)
{
	var TreeActionsModule			= window.Oyster.Modules.Routing.TreeActionsModule;
	var getSimpleNavigationModule	= window.Example.Modules.getSimpleNavigationModule;
	
	var Application		= window.Oyster.Application;
	var PathMatchRoutes	= window.Example.PathMatch.PathMatchRoutes;
	
	
	this.PathMatchExample = function ()
	{
		Application.create(
			[
				getSimpleNavigationModule(),
				TreeActionsModule
			], 
			function setupApplication(app, routing)
			{
				routing.setupRoutes(PathMatchRoutes);
				app.run();
			});
	};
});