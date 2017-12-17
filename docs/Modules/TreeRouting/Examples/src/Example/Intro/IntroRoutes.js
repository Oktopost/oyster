namespace('Example.Intro', function (window)
{
	var IntroAction = window.Example.Intro.IntroAction;
	
	
	this.IntroRoutes = {
		$:
		{
			path: '/intro',
			action: IntroAction
		}
	};
});