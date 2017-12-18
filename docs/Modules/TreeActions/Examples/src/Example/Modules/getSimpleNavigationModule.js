namespace('Example.Modules', function (window) 
{
	var SimpleNavigationModule	= window.Oyster.Modules.Navigation.SimpleNavigationModule;
	
	
	this.getSimpleNavigationModule = function getSimpleNavigationModule()
	{
		return SimpleNavigationModule.create({
			/** 
			 * @param {SimpleNavigationModule} navigation
			 * @param {TreeActionsModule} routing
			 */
			init: function (navigation, routing)
			{
				$(window).on('popstate', function (e)
				{			
					routing.handleURL(window.location.pathname + window.location.search);
				});
				
				$(document).on('click', 'a', function (e) 
				{
					e.preventDefault();
					navigation.navigate($(this).attr('href'));
				});	
			}
		});
	};
});