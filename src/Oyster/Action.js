namespace('Oyster', function (root)
{
	var classify = root.Classy.classify;


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
		classify(this);
		
		this._chainLink = chainLink || null;
		this._navigator	= navigator || null;
		this._params	= null;
	}
	
	
	/**
	 * @returns {ActionChainLink|null}
	 */
	Action.prototype.chain = function ()
	{
		return this._chainLink;
	};
	
	/**
	 * @return {{}|null}
	 */
	Action.prototype.params = function ()
	{
		return this._params;
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
	
	
	this.Action = Action;
});