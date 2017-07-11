namespace('Oyster', function (root)
{
	var classify = root.Classy.classify;


	/**
	 * @class Oyster.Action
	 * @alias Action
	 * 
	 * @property {ActionChainLink|null} _chainLink
	 * @property {{}|null} _params
	 * 
	 * @param {ActionChainLink=} chainLink
	 * @constructor
	 */
	function Action(chainLink)
	{
		classify(this);
		
		this._chainLink = chainLink || null;
		this._params = null;
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
	 * @param {ActionChainLink} chainLink
	 */
	Action.prototype.setChainLink = function (chainLink)
	{
		this._chainLink = chainLink;
	};
	
	
	this.Action = Action;
});