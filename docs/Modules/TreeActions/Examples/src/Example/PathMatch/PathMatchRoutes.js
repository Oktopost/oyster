namespace('Example.PathMatch', function (window)
{
	var MainAction		= window.Example.PathMatch.MainAction;
	var SecondAction	= window.Example.PathMatch.SecondAction;
	
	
	this.PathMatchRoutes = {
		Main:
		{
			$:
			{
				path: '/path_match',
				action: MainAction
			}
		},
		Second:
		{
			$:
			{
				path: '/different/path',
				action: SecondAction
			}
		}
	};
});