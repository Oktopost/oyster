namespace('Example', function (window)
{
	var TreeActionsModule			= window.Oyster.Modules.Routing.TreeActionsModule;
	var HistoryJsNavigationModule	= window.Example.Modules.HistoryJsNavigationModule;
	
	var Application			= window.Oyster.Application;
	var ChainSetupRoutes	= window.Example.ChainSetup.ChainSetupRoutes;
	
	
	this.ChainExample = function ()
	{
		Application.create(
			[
				HistoryJsNavigationModule,
				TreeActionsModule
			], 
			function setupApplication(app, routing)
			{
				routing.setupRoutes(ChainSetupRoutes);
				app.run();
			});
	};
});