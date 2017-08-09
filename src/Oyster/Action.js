namespace('Oyster', function (root)
{
	var obj			= root.Plankton.obj;
	var classify	= root.Classy.classify;
	
	var LifeTime		= root.Duct.LifeTime;
	var LifeBindFactory	= root.Duct.LT.LifeBindFactory;
	
	var ActionEvents = root.Oyster.Modules.Routing.TreeActions.ActionEvents;


	/**
	 * @class Oyster.Action
	 * @alias Action
	 * 
	 * @property {ActionChainLink|null} _chainLink
	 * @property {Navigator|null}		_navigator
	 * @property {{}|null}				_params
	 * 
	 * @param {Navigator=}			navigator
	 * @param {ActionChainLink=}	chainLink
	 * @constructor
	 */
	function Action(navigator, chainLink)
	{
		var self = classify(this);
		
		this._chainLink = chainLink || null;
		this._navigator	= navigator || null;
		this._params	= null;
		this._events	= new ActionEvents();
		this._lt		= new LifeTime();
		
		this._events.onDestroy(function () 
		{
			self._lt.kill();
		});
	}
	
	
	/**
	 * @returns {ActionChainLink|null}
	 */
	Action.prototype.chain = function ()
	{
		return this._chainLink;
	};
	
	/**
	 * @returns {Application}
	 */
	Action.prototype.app = function ()
	{
		return this._chainLink.app();
	};
	
	/**
	 * @returns {ActionEvents}
	 */
	Action.prototype.events = function ()
	{
		return this._events;
	};
	
	/**
	 * @returns {LifeTime|LifeBind}
	 */
	Action.prototype.LT = function ()
	{
		return this._lt;
	};
	
	/**
	 * @param {string=} name
	 * @return {ModuleManager|*}
	 */
	Action.prototype.modules = function (name)
	{
		var app = this._chainLink.app();
		return (app ? app.modules(name) : null);
	};
	
	/**
	 * @return {{}|null}
	 */
	Action.prototype.params = function ()
	{
		return obj.copy(this._params);
	};
	
	/**
	 * @param {{}} params
	 */
	Action.prototype.setParams = function (params)
	{
		this._params = params;
	};
	
	/**
	 * @param {*} target
	 * @param {{}=} params
	 */
	Action.prototype.navigate = function (target, params)
	{
		this._navigator.goto(target, params);
	};
	
	/** 
	 * @param {*} target
	 * @param {{}=} params
	 * @return {string}
	 */
	Action.prototype.linkTo = function (target, params)
	{
		return this._navigator.link(target, params);
	};
	
	/**
	 * @param {ActionChainLink} chainLink
	 */
	Action.prototype.setChainLink = function (chainLink)
	{
		this._chainLink = chainLink;
	};
	
	/**
	 * @param {Navigator} navigator
	 */
	Action.prototype.setNavigator = function (navigator)
	{
		this._navigator = navigator;
	};
	
	
	Action.lifeTimeBuilder = function (item)
	{
		return item instanceof Action ? 
			item.LT() : 
			null;
	};
	
	
	LifeBindFactory.instance().addBuilder(Action.lifeTimeBuilder);
	
	
	this.Action = Action;
});