namespace('Oyster', function (root)
{
	var is				= root.Plankton.is;
	var classify		= root.Classy.classify;
	
	var LifeTimeNode	= root.Duct.LifeTimeNode;
	var LifeBindFactory	= root.Duct.LT.LifeBindFactory;
	
	
	/**
	 * @property {ModuleManager} _moduleManager
	 * @constructor
	 */
	function Component()
	{
		var self = this;
		
		this._moduleManager	= null;
		this._node			= new LifeTimeNode(this);
		
		this._node.onAttached(function () { self.mount(self._moduleManager); });
		this._node.onDestroy(function () { self.unmount(); });
		
		classify(this);
	}
	
	
	/**
	 * @protected
	 */
	Component.prototype._isAlive = function ()
	{
		return this._node.isAlive();
	};
	
	/**
	 * @protected
	 */
	Component.prototype._isDestroyed = function ()
	{
		return this._node.isDestroyed();
	};
	
	/**
	 * @param {ModuleManager} manager
	 * @protected
	 */
	Component.prototype._setModuleManager = function (manager)
	{
		this._moduleManager = manager;
	};
	
	/**
	 * @protected
	 */
	Component.prototype._destroy = function ()
	{
		this._node.destroy();
	};
	
	/**
	 * @param {string=} name
	 * @return {Module|ModuleManager|null}
	 * @protected
	 */
	Component.prototype.manager = function (name)
	{
		if (!is(this._moduleManager))
			return null;
		if (is(name))
			return this._moduleManager.get(name);
		else 
			return this._moduleManager;
	};
	
	/**
	 * 
	 * @param {function|Component} item
	 * @return {Component}
	 */
	Component.prototype.component = function (item)
	{
		if (is.function(item))
			item = new item();
		
		item._moduleManager = this._moduleManager;
		this._node.attachChild(item._node);
		
		return item;
	};
	
	
	Component.prototype.mount = function () {};
	Component.prototype.unmount = function () {};
	
	
	/**
	 * @return {LifeTime}
	 */
	Component.prototype.LT = function ()
	{
		return this._node.LT();
	};
	
	/**
	 * @return {LifeTimeNode}
	 */
	Component.prototype.getLifeTimeNode = function ()
	{
		return this._node;
	};
	
	
	LifeBindFactory.instance().addBuilder(function (item)
	{
		if (item instanceof Component)
			return item.LT();
	});
	
	
	this.Component = Component;
});