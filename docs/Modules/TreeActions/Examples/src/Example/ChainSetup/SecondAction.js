namespace('Example.ChainSetup', function (window)
{
	var Action = window.Oyster.Action;
	
	var inherit		= window.Classy.inherit;
	var classify	= window.Classy.classify;
	
	
	function SecondAction()
	{
		Action.call(this);
		classify(this);
	}
	
	
	inherit(SecondAction, Action);
	
	
	SecondAction.prototype.initialize = function ()
	{
		console.log('SecondAction initializing');
	};
	
	SecondAction.prototype.activate = function ()
	{
		console.log('SecondAction activating');
	};
	
	SecondAction.prototype.execute = function ()
	{
		console.log('SecondAction executing');
	};
	
	SecondAction.prototype.refresh = function ()
	{
		console.log('FirstAction refreshed');
	};
	
	SecondAction.prototype.preDestroy = function ()
	{
		console.log('SecondAction will be destroyed');
	};
	
	SecondAction.prototype.destroy = function ()
	{
		console.log('SecondAction was destroyed');
	};
	
	
	this.SecondAction = SecondAction;
});