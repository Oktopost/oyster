namespace('Oyster', function (root)
{
	var LifeTime		= root.Duct.LifeTime;
	var LifeBindFactory	= root.Duct.LT.LifeBindFactory;
	
	var classify = root.Classy.classify;


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
		classify(this);
		
		this._controller 	= null;
		this._lt			= new LifeTime();
	}
	
	
	/**
	 * @param {ModuleController} controller
	 */
	Module.prototype.setController = function (controller)
	{
		this._controller = controller;
	};

	/**
	 * @returns {ModuleController}
	 */
	Module.prototype.control = function ()
	{
		return this._controller;
	};
	
	/**
	 * @return {LifeTime}
	 */
	Module.prototype.LT = function ()
	{
		return this._lt;
	};
	
	/**
	 * @return {ModuleManager}
	 */
	Module.prototype.manager = function ()
	{
		return this._controller.manager();
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