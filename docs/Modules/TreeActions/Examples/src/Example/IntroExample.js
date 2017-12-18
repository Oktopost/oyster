namespace('Example', function (window)
{
	var TreeActionsModule			= window.Oyster.Modules.Routing.TreeActionsModule;
	var getSimpleNavigationModule	= window.Example.Modules.getSimpleNavigationModule;
	
	var Application = window.Oyster.Application;
	var IntroRoutes = window.Example.Intro.IntroRoutes;
	
	
	this.IntroExample = function ()
	{
		Application.create(
			[
				getSimpleNavigationModule(),
				TreeActionsModule
			], 
			function setupApplication(app, routing)
			{
				routing.setupRoutes(IntroRoutes);
				app.run();
			});
	};
});