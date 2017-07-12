namespace('Oyster.Actions', function (root)
{
	/**
	 * @class {Oyster.Actions.ActionChainLink}
	 * @alias {ActionChainLink}
	 * 
	 * @property {ActionChainLink}	_child
	 * @property {ActionChainLink}	_parent
	 * @property {Oyster.Action}	_action
	 * @property {boolean}			_isMounted
	 * 
	 * @param {Action} action
	 * @constructor
	 */
	function ActionChainLink(action)
	{
		this._child		= null;
		this._parent	= null;
		this._action	= action;
		this._isMounted	= false;
		
		action.setChainLink(this);
	}
	
	
	/**
	 * @returns {Oyster.Action}
	 */
	ActionChainLink.prototype.action = function ()
	{
		return this._action;
	};
	
	/**
	 * @returns {ActionChainLink|null}
	 */
	ActionChainLink.prototype.child = function ()
	{
		return this._child;
	};
	
	/**
	 * @returns {ActionChainLink|null}
	 */
	ActionChainLink.prototype.parent = function ()
	{
		return this._parent;
	};
	
	/**
	 * @returns {Oyster.Action|null}
	 */
	ActionChainLink.prototype.childAction = function ()
	{
		return (this._child === null ? null : this._child.action());
	};
	
	/**
	 * @returns {Action|null}
	 */
	ActionChainLink.prototype.parentAction = function ()
	{
		return (this._parent === null ? null : this._parent.action());
	};
	
	/**
	 * @returns {boolean}
	 */
	ActionChainLink.prototype.hasChild = function ()
	{
		return (this._child !== null);
	};
	
	/**
	 * @returns {boolean}
	 */
	ActionChainLink.prototype.hasParent = function ()
	{
		return (this._parent !== null);
	};
	
	/**
	 * @returns {boolean}
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
	 * @param {ActionChainLink} child
	 * @param {ActionChainLink} parent
	 */
	ActionChainLink.updateRelations = function (link, child, parent)
	{
		link._child = child;
		link._parent = parent;
		link._isMounted = true;
	};
	
	
	this.ActionChainLink = ActionChainLink;
});