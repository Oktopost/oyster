namespace('Oyster.Actions', function (root)
{
	var classify 	= root.Classy.classify;
	

	/**
	 * @class Oyster.Actions.ActionChainLink
	 * @alias {ActionChainLink}
	 * 
	 * @property {Action|null} _child
	 * @property {Action|null} _parent
	 * @property {boolean} _isMounted
	 * 
	 * @constructor
	 */
	function ActionChainLink()
	{
		classify(this);
		
		this._isMounted	= true;
		this._child		= null;
		this._parent	= null;
	}
	
	
	/**
	 * @returns {Action|null}
	 */
	ActionChainLink.prototype.child = function ()
	{
		return this._child;
	};
	
	/**
	 * @returns {Action|null}
	 */
	ActionChainLink.prototype.parent = function ()
	{
		return this._parent;
	};
	
	/**
	 * @returns {Action|null}
	 */
	ActionChainLink.prototype.hasChild = function ()
	{
		return this._child !== null;
	};
	
	/**
	 * @returns {Action|null}
	 */
	ActionChainLink.prototype.hasParent = function ()
	{
		return this._parent !== null;
	};
	
	/**
	 * @returns {Action|null}
	 */
	ActionChainLink.prototype.isMounted = function ()
	{
		return this._isMounted;
	};
	
	
	/**
	 * @param {ActionChainLink} link
	 */
	ActionChainLink.unmount = function (link)
	{
		link._child = null;
		link._parent = null;
		link._isMounted = false;
	};
	
	/**
	 * @param {ActionChainLink} link
	 * @param {Action} child
	 * @param {Action} parent
	 */
	ActionChainLink.updateRelations = function (link, child, parent)
	{
		link._child = child;
		link._parent = parent;
	};
	
	
	this.ActionChainLink = ActionChainLink;
});