namespace('Example', function (window)
{
	var TreeActionsModule			= window.Oyster.Modules.Routing.TreeActionsModule;
	var HistoryJsNavigationModule	= window.Example.Modules.HistoryJsNavigationModule;
	
	var Application = window.Oyster.Application;
	var IntroRoutes = window.Example.Intro.IntroRoutes;
	
	
	this.IntroExample = function ()
	{
		Application.create(
			[
				HistoryJsNavigationModule,
				TreeActionsModule
			], 
			function setupApplication(app, routing)
			{
				routing.setupRoutes(IntroRoutes);
				app.run();
			});
	};
});