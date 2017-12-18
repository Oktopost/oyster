namespace('Example.PathMatch', function (window)
{
	var Action = window.Oyster.Action;
	
	var inherit		= window.Classy.inherit;
	var classify	= window.Classy.classify;
	
	
	function MainAction()
	{
		Action.call(this);
		classify(this);
	}
	
	
	inherit(MainAction, Action);
	
	
	MainAction.prototype.initialize = function ()
	{
		console.log('MainAction initializing');
	};
	
	MainAction.prototype.activate = function ()
	{
		console.log('MainAction activating');
	};
	
	MainAction.prototype.execute = function ()
	{
		console.log('MainAction executing');
	};
	
	MainAction.prototype.preDestroy = function ()
	{
		console.log('MainAction will be destroyed');
	};
	
	MainAction.prototype.destroy = function ()
	{
		console.log('MainAction was destroyed');
	};
	
	
	this.MainAction = MainAction;
});