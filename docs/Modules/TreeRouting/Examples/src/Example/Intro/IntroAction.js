namespace('Example.Intro', function (window)
{
	var Action = window.Oyster.Action;
	
	var inherit		= window.Classy.inherit;
	var classify	= window.Classy.classify;
	
	
	function IntroAction()
	{
		Action.call(this);
		classify(this);
	}
	
	
	inherit(IntroAction, Action);
	
	
	IntroAction.prototype.initialize = function ()
	{
		console.log('IntroAction initializing');
	};
	
	IntroAction.prototype.activate = function ()
	{
		console.log('IntroAction activating');
	};
	
	IntroAction.prototype.execute = function ()
	{
		console.log('IntroAction executing');
	};
	
	
	this.IntroAction = IntroAction;
});