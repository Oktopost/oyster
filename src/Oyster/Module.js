namespace('Oyster', function (root)
{
	var LifeBindFactory	= root.Duct.LT.LifeBindFactory;
	
	var inherit		= root.Classy.inherit;
	var classify	= root.Classy.classify;
	
	var Component	= root.Oyster.Component;


	/**
	 * @class {Oyster.Module}
	 * @alias {Module}
	 * 
	 * @property {ModuleController} _controller
	 * 
	 * @constructor
	 */
	function Module()
	{
		Component.call(this);
		
		classify(this);
		
		this._controller = null;
	}
	
	
	inherit(Module, Component);
	
	
	/**
	 * @param {ModuleController} controller
	 */
	Module.prototype.setController = function (controller)
	{
		this._controller = controller;
		this._setModuleManager(this._controller.manager());
	};

	/**
	 * @returns {ModuleController}
	 */
	Module.prototype.control = function ()
	{
		return this._controller;
	};
	
	/**
	 * @return {ModuleManager}
	 */
	Module.prototype.manager = function ()
	{
		return this._manager();
	};
	
	/**
	 * @return {Application}
	 */
	Module.prototype.app = function ()
	{
		return this._controller.app();
	};
	
	
	Module.prototype.initialize = function () {};
	
	Module.prototype.preLoad = function () {};
	Module.prototype.onLoad = function () {};
	Module.prototype.postLoad = function () {};
	
	Module.prototype.preUnload = function () {};
	Module.prototype.onUnload = function () {};
	Module.prototype.postUnload = function () {};
	
	Module.prototype.destroy = function () {};
	
	
	Module.lifeTimeBuilder = function (item)
	{
		return item instanceof Module ? 
			item.LT() : 
			null;
	};
	
	
	LifeBindFactory.instance().addBuilder(Module.lifeTimeBuilder);
	
	
	this.Module = Module;
});