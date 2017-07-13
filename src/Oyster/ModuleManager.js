namespace('Oyster', function (root)
{
	var classify 	= root.Classy.classify;
	
	var is			= root.Plankton.is;
	var func		= root.Plankton.func;
	var array		= root.Plankton.array;
	var foreach		= root.Plankton.foreach;
	
	var Loader			= root.Oyster.Modules.Utils.Loader;
	var ModuleBuilder	= root.Oyster.Modules.Utils.ModuleBuilder;
	
	
	/**
	 * @class {Oyster.ModuleManager}
	 * @alias {ModuleManager}
	 * 
	 * @property {*} _modules
	 * @property {Loader} _loader
	 * 
	 * @constructor
	 */
	function ModuleManager()
	{
		classify(this);
		
		this._modules = {};
		this._onCompleteCallbacks = [];
		this._loader = new Loader(this._register, this._deRegister, this._invokeOnComplete);
	}
	
	/**
	 * @param {*} element
	 * @return {string}
	 * @private
	 */
	ModuleManager.prototype._extractName = function (element)
	{
		if (is.string(element)) return element;
		else if (is.string(element.moduleName)) return element.moduleName;
		else if (is.function(element.moduleName)) return element.moduleName();
		else return element.toString();
	};
	
	/**
	 * @param {Module} module
	 * @private
	 */
	ModuleManager.prototype._register = function (module)
	{
		var name = module.control().name();
		
		if (is(this._modules[name]))
			throw new Error('Module with the name ' + name + ' is already registered!');
		
		this._modules[name] = module;
	};
	
	/**
	 * @param {Module} module
	 * @private
	 */
	ModuleManager.prototype._deRegister = function (module)
	{
		var name = module.control().name();
		
		if (!is(this._modules[name]))
			throw new Error('Module with the name ' + name + ' is not registered!');
		
		delete this._modules[name];
	};
	
	ModuleManager.prototype._invokeOnComplete = function ()
	{
		var callbacks = this._onCompleteCallbacks.concat();
		
		this._onCompleteCallbacks = [];
		
		foreach(callbacks, function (callback) { callback(); });
	};
	
	
	/**
	 * @param {Module} module
	 * @returns {ModuleManager}
	 */
	ModuleManager.prototype.remove = function (module)
	{
		this._loader.unload(module);
		return this;
	};

	/**
	 * @param {string|Module|function|{}|[]} target
	 * @param {string|Module|function=} extra
	 */
	ModuleManager.prototype.add = function (target, extra)
	{
		target = ModuleBuilder.get(this, target, extra);
		target = array(target);
		
		this._loader.load(target);
	};

	/**
	 * @param {string} name
	 * @returns {Module|null}
	 */
	ModuleManager.prototype.get = function (name) 
	{
		return this._modules[this._extractName(name)] || null;
	};

	/**
	 * @param {string} name
	 * @returns {boolean}
	 */
	ModuleManager.prototype.has = function (name) 
	{
		return is(this._modules[this._extractName(name)]);
	};
	
	/**
	 * @param {function} callback
	 */
	ModuleManager.prototype.onLoaded = function (callback)
	{
		this._onCompleteCallbacks.push(callback);
		
		if (!this._loader.isLoading())
		{
			func.async.do(this._invokeOnComplete);
		}
	};
	
	
	this.ModuleManager = ModuleManager;
});