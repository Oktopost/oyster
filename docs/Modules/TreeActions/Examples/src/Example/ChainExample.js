namespace('Example', function (window)
{
	var TreeActionsModule			= window.Oyster.Modules.Routing.TreeActionsModule;
	var getSimpleNavigationModule	= window.Example.Modules.getSimpleNavigationModule;
	
	var Application			= window.Oyster.Application;
	var ChainSetupRoutes	= window.Example.ChainSetup.ChainSetupRoutes;
	
	
	this.ChainExample = function ()
	{
		Application.create(
			[
				getSimpleNavigationModule(),
				TreeActionsModule
			], 
			function setupApplication(app, routing)
			{
				routing.setupRoutes(ChainSetupRoutes);
				app.run();
			});
	};
});