namespace('Example.ChainSetup', function (window)
{
	var MainAction		= window.Example.ChainSetup.MainAction;
	var FirstAction		= window.Example.ChainSetup.FirstAction;
	var SecondAction	= window.Example.ChainSetup.SecondAction;
	
	
	this.ChainSetupRoutes = {
		$:
		{
			path: '/chain',
			action: MainAction
		},
		FirstChild:
		{
			$:
			{
				path: 'first',
				action: FirstAction
			},
			SecondChild:
			{
				$:
				{
					path: 'second',
					action: SecondAction
				}
			}
		}
	};
});