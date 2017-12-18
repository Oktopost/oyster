namespace('Example.ChainSetup', function (window)
{
	var Action = window.Oyster.Action;
	
	var inherit		= window.Classy.inherit;
	var classify	= window.Classy.classify;
	
	
	function FirstAction()
	{
		Action.call(this);
		classify(this);
	}
	
	
	inherit(FirstAction, Action);
	
	
	FirstAction.prototype.initialize = function ()
	{
		console.log('FirstAction initializing');
	};
	
	FirstAction.prototype.activate = function ()
	{
		console.log('FirstAction activating');
	};
	
	FirstAction.prototype.execute = function ()
	{
		console.log('FirstAction executing');
	};
	
	FirstAction.prototype.refresh = function ()
	{
		console.log('FirstAction refreshed');
	};
	
	FirstAction.prototype.preDestroy = function ()
	{
		console.log('FirstAction will be destroyed');
	};
	
	FirstAction.prototype.destroy = function ()
	{
		console.log('FirstAction was destroyed');
	};
	
	
	this.FirstAction = FirstAction;
});