namespace('Oyster', function (root)
{
	var classify = root.Classy.classify;


	/**
	 * @class Oyster.Module
	 * @alias Module
	 * 
	 * @property {ModuleController} _controller
	 * 
	 * @constructor
	 */
	function Module()
	{
		classify(this);
		
		this._controller = null;
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
	Module.prototype.module = function ()
	{
		return this._controller;
	};
	
	/**
	 * @return {ModuleManager}
	 */
	Module.prototype.manager = function ()
	{
		return this._controller.manager();
	};
	
	
	Module.prototype.initialize = function () {};
	
	Module.prototype.preLoad = function () {};
	Module.prototype.onLoad = function () {};
	Module.prototype.postLoad = function () {};
	
	Module.prototype.preUnload = function () {};
	Module.prototype.onUnload = function () {};
	Module.prototype.postUnload = function () {};
	
	Module.prototype.destroy = function () {};
	
	
	this.Module = Module;
});